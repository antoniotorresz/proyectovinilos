import { useEffect, useMemo, useState } from "react";
import {
  Disc3,
  Pencil,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";

import type { Publication } from "../types/Publication";
import {
  deletePublication,
  getPublications,
} from "../services/publicationService";

import type { User } from "../services/userService";
import {
  getAllUsers,
  updateUserRole,
} from "../services/userService";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export default function AdminPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [publications, setPublications] =
    useState<Publication[]>([]);

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [publicationSearch, setPublicationSearch] =
    useState("");

  const [userSearch, setUserSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("ALL");

  const [
    publicationToDelete,
    setPublicationToDelete,
  ] = useState<Publication | null>(null);

  const [deletingPublication, setDeletingPublication] =
    useState(false);

  const [updatingUserId, setUpdatingUserId] =
    useState<number | null>(null);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          publicationData,
          userData,
        ] = await Promise.all([
          getPublications(),
          getAllUsers(),
        ]);

        setPublications(
          publicationData
        );

        setUsers(
          userData
        );
      } catch (err) {
        console.error(err);

        setError(
          "No se pudo cargar la información de administración."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const filteredPublications =
    useMemo(() => {
      const term =
        publicationSearch
          .trim()
          .toLowerCase();

      if (!term) {
        return publications;
      }

      return publications.filter(
        (publication) =>
          publication.name
            ?.toLowerCase()
            .includes(term) ||
          publication.albumName
            ?.toLowerCase()
            .includes(term) ||
          publication.artist
            ?.toLowerCase()
            .includes(term) ||
          publication.format
            ?.toLowerCase()
            .includes(term) ||
          publication.genre
            ?.toLowerCase()
            .includes(term) ||
          publication.user?.name
            ?.toLowerCase()
            .includes(term)
      );
    }, [
      publications,
      publicationSearch,
    ]);

  const filteredUsers =
    useMemo(() => {
      const term =
        userSearch
          .trim()
          .toLowerCase();

      return users.filter(
        (item) => {
          const matchesSearch =
            !term ||
            item.name
              .toLowerCase()
              .includes(term) ||
            item.email
              .toLowerCase()
              .includes(term);

          const matchesRole =
            roleFilter ===
              "ALL" ||
            item.role ===
              roleFilter;

          return (
            matchesSearch &&
            matchesRole
          );
        }
      );
    }, [
      users,
      userSearch,
      roleFilter,
    ]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleDeletePublication =
    async () => {
      if (!publicationToDelete) {
        return;
      }

      try {
        setDeletingPublication(
          true
        );

        clearMessages();

        await deletePublication(
          publicationToDelete.id
        );

        setPublications(
          (prev) =>
            prev.filter(
              (item) =>
                item.id !==
                publicationToDelete.id
            )
        );

        setSuccess(
          "Publicación eliminada correctamente."
        );

        setPublicationToDelete(
          null
        );
      } catch (err) {
        console.error(err);

        setError(
          "No se pudo eliminar la publicación."
        );
      } finally {
        setDeletingPublication(
          false
        );
      }
    };

  const canCurrentUserModifyRole = (
    targetUser: User
  ) => {
    if (!user) {
      return false;
    }

    if (
      targetUser.id ===
      user.id
    ) {
      return false;
    }

    if (
      targetUser.role ===
      "SUPER_ADMIN"
    ) {
      return false;
    }

    if (
      user.role ===
      "SUPER_ADMIN"
    ) {
      return true;
    }

    if (
      user.role ===
      "ADMIN"
    ) {
      return false;
    }

    return false;
  };

  const handleRoleChange = async (
    targetUser: User,
    newRole: "USER" | "ADMIN"
  ) => {
    if (
      !canCurrentUserModifyRole(
        targetUser
      )
    ) {
      setError(
        "No tienes permisos para modificar el rol de este usuario."
      );

      return;
    }

    if (
      targetUser.role ===
      newRole
    ) {
      return;
    }

    try {
      setUpdatingUserId(
        targetUser.id
      );

      clearMessages();

      const updated =
        await updateUserRole(
          targetUser.id,
          newRole
        );

      setUsers((prev) =>
        prev.map((item) =>
          item.id ===
          updated.id
            ? updated
            : item
        )
      );

      setSuccess(
        `Rol de ${updated.name} actualizado a ${updated.role}.`
      );
    } catch (err) {
      console.error(err);

      setError(
        "No se pudo actualizar el rol del usuario."
      );
    } finally {
      setUpdatingUserId(
        null
      );
    }
  };

  const getRoleLabel = (
    role: User["role"]
  ) => {
    if (
      role ===
      "SUPER_ADMIN"
    ) {
      return "SUPER ADMIN";
    }

    return role;
  };

  if (loading) {
    return (
      <div className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-10">
        <div
          className="rounded-lg p-10 text-center"
          style={{
            background:
              "#161b27",
            border:
              "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p
            className="text-[13px]"
            style={{
              color:
                "#8892a4",
            }}
          >
            Cargando panel de administración...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck
            size={26}
            style={{
              color:
                "#f59e0b",
            }}
          />

          <h1
            className="text-2xl font-bold"
            style={{
              color:
                "#e8eaf0",
            }}
          >
            Administración
          </h1>
        </div>

        <p
          style={{
            color:
              "#8892a4",
          }}
        >
          Panel de administración de Music Market.
        </p>

        <p
          className="text-[12px] mt-2"
          style={{
            color:
              "#6f7890",
          }}
        >
          Sesión: {user?.name} —{" "}
          {user
            ? getRoleLabel(
                user.role
              )
            : ""}
        </p>
      </div>

      {error && (
        <div
          className="mb-5 rounded-lg p-4 text-[13px]"
          style={{
            background:
              "rgba(239,68,68,0.08)",
            border:
              "1px solid rgba(239,68,68,0.2)",
            color:
              "#ef4444",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="mb-5 rounded-lg p-4 text-[13px]"
          style={{
            background:
              "rgba(34,197,94,0.08)",
            border:
              "1px solid rgba(34,197,94,0.2)",
            color:
              "#22c55e",
          }}
        >
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <SummaryCard
          label="Publicaciones"
          value={
            publications.length
          }
          icon={
            <Disc3
              size={32}
            />
          }
        />

        <SummaryCard
          label="Usuarios"
          value={
            users.length
          }
          icon={
            <Users
              size={32}
            />
          }
        />
      </div>

      <section>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h2
              className="text-lg font-bold"
              style={{
                color:
                  "#e8eaf0",
              }}
            >
              Publicaciones
            </h2>

            <p
              className="text-[12px] mt-1"
              style={{
                color:
                  "#8892a4",
              }}
            >
              Administra todas las publicaciones del marketplace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <SearchBox
              value={
                publicationSearch
              }
              onChange={
                setPublicationSearch
              }
              placeholder="Buscar publicación..."
            />

            <button
              onClick={() =>
                navigate(
                  "/publish"
                )
              }
              className="px-4 py-2 rounded text-[12px] font-semibold"
              style={{
                background:
                  "#f59e0b",
                color:
                  "#0f1117",
              }}
            >
              Nueva publicación
            </button>
          </div>
        </div>

        <div
          className="rounded-lg overflow-hidden"
          style={{
            background:
              "#161b27",
            border:
              "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {filteredPublications.length ===
          0 ? (
            <div className="p-8 text-center">
              <p
                className="text-[13px]"
                style={{
                  color:
                    "#8892a4",
                }}
              >
                {publicationSearch
                  ? "No se encontraron publicaciones con ese criterio."
                  : "No hay publicaciones disponibles."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead
                  style={{
                    background:
                      "#1e2433",
                    color:
                      "#8892a4",
                  }}
                >
                  <tr>
                    <th className="px-4 py-3 text-[11px] uppercase">
                      Producto
                    </th>

                    <th className="px-4 py-3 text-[11px] uppercase">
                      Artista
                    </th>

                    <th className="px-4 py-3 text-[11px] uppercase">
                      Formato
                    </th>

                    <th className="px-4 py-3 text-[11px] uppercase">
                      Precio
                    </th>

                    <th className="px-4 py-3 text-[11px] uppercase">
                      Usuario
                    </th>

                    <th className="px-4 py-3 text-[11px] uppercase text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPublications.map(
                    (
                      publication
                    ) => (
                      <tr
                        key={
                          publication.id
                        }
                        style={{
                          borderTop:
                            "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <td className="px-4 py-3 text-[13px]">
                          {publication.albumName ||
                            publication.name}
                        </td>

                        <td
                          className="px-4 py-3 text-[13px]"
                          style={{
                            color:
                              "#8892a4",
                          }}
                        >
                          {publication.artist ||
                            "—"}
                        </td>

                        <td
                          className="px-4 py-3 text-[13px]"
                          style={{
                            color:
                              "#8892a4",
                          }}
                        >
                          {publication.format ||
                            "—"}
                        </td>

                        <td
                          className="px-4 py-3 text-[13px]"
                          style={{
                            color:
                              "#f59e0b",
                          }}
                        >
                          USD{" "}
                          {Number(
                            publication.price
                          ).toFixed(
                            2
                          )}
                        </td>

                        <td
                          className="px-4 py-3 text-[13px]"
                          style={{
                            color:
                              "#8892a4",
                          }}
                        >
                          {publication.user?.name ||
                            "Sin usuario"}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `/publications/${publication.id}/edit`
                                )
                              }
                              className="p-2 rounded hover:opacity-80"
                              style={{
                                background:
                                  "#1e2433",
                                color:
                                  "#c4c8d8",
                                border:
                                  "1px solid rgba(255,255,255,0.08)",
                              }}
                              title="Editar"
                            >
                              <Pencil
                                size={
                                  14
                                }
                              />
                            </button>

                            <button
                              onClick={() =>
                                setPublicationToDelete(
                                  publication
                                )
                              }
                              className="p-2 rounded hover:opacity-80"
                              style={{
                                background:
                                  "#7f1d1d",
                                color:
                                  "#ffffff",
                              }}
                              title="Eliminar"
                            >
                              <Trash2
                                size={
                                  14
                                }
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
          <div>
            <h2
              className="text-lg font-bold"
              style={{
                color:
                  "#e8eaf0",
              }}
            >
              Usuarios
            </h2>

            <p
              className="text-[12px] mt-1"
              style={{
                color:
                  "#8892a4",
              }}
            >
              Administra los usuarios y sus roles.
            </p>

            {user?.role ===
              "ADMIN" && (
              <p
                className="text-[11px] mt-2"
                style={{
                  color:
                    "#6f7890",
                }}
              >
                Los administradores pueden consultar usuarios, pero solo el SUPER ADMIN puede modificar roles.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <SearchBox
              value={
                userSearch
              }
              onChange={
                setUserSearch
              }
              placeholder="Buscar usuario..."
            />

            <select
              value={
                roleFilter
              }
              onChange={(e) =>
                setRoleFilter(
                  e.target.value
                )
              }
              className="text-[12px] px-3 py-2 rounded outline-none"
              style={{
                background:
                  "#1e2433",
                color:
                  "#c4c8d8",
                border:
                  "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <option value="ALL">
                Todos los roles
              </option>

              <option value="USER">
                USER
              </option>

              <option value="ADMIN">
                ADMIN
              </option>

              <option value="SUPER_ADMIN">
                SUPER ADMIN
              </option>
            </select>
          </div>
        </div>

        <div
          className="rounded-lg overflow-hidden"
          style={{
            background:
              "#161b27",
            border:
              "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {filteredUsers.length ===
          0 ? (
            <div className="p-8 text-center">
              <p
                className="text-[13px]"
                style={{
                  color:
                    "#8892a4",
                }}
              >
                No se encontraron usuarios.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead
                  style={{
                    background:
                      "#1e2433",
                    color:
                      "#8892a4",
                  }}
                >
                  <tr>
                    <th className="px-4 py-3 text-[11px] uppercase">
                      Nombre
                    </th>

                    <th className="px-4 py-3 text-[11px] uppercase">
                      Correo
                    </th>

                    <th className="px-4 py-3 text-[11px] uppercase">
                      Proveedor
                    </th>

                    <th className="px-4 py-3 text-[11px] uppercase">
                      Rol
                    </th>

                    <th className="px-4 py-3 text-[11px] uppercase">
                      Miembro desde
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map(
                    (item) => {
                      const canModify =
                        canCurrentUserModifyRole(
                          item
                        );

                      const isUpdating =
                        updatingUserId ===
                        item.id;

                      return (
                        <tr
                          key={
                            item.id
                          }
                          style={{
                            borderTop:
                              "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <td className="px-4 py-3 text-[13px]">
                            <div>
                              <span>
                                {
                                  item.name
                                }
                              </span>

                              {item.id ===
                                user?.id && (
                                <span
                                  className="ml-2 text-[10px]"
                                  style={{
                                    color:
                                      "#6f7890",
                                  }}
                                >
                                  (Tú)
                                </span>
                              )}
                            </div>
                          </td>

                          <td
                            className="px-4 py-3 text-[13px]"
                            style={{
                              color:
                                "#8892a4",
                            }}
                          >
                            {
                              item.email
                            }
                          </td>

                          <td
                            className="px-4 py-3 text-[13px]"
                            style={{
                              color:
                                "#8892a4",
                            }}
                          >
                            {
                              item.provider
                            }
                          </td>

                          <td className="px-4 py-3">
                            {item.role ===
                            "SUPER_ADMIN" ? (
                              <RoleBadge
                                role="SUPER_ADMIN"
                              />
                            ) : canModify ? (
                              <select
                                value={
                                  item.role
                                }
                                disabled={
                                  isUpdating
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleRoleChange(
                                    item,
                                    e
                                      .target
                                      .value as
                                      | "USER"
                                      | "ADMIN"
                                  )
                                }
                                className="text-[12px] px-3 py-1.5 rounded outline-none disabled:opacity-50"
                                style={{
                                  background:
                                    "#1e2433",
                                  color:
                                    item.role ===
                                    "ADMIN"
                                      ? "#f59e0b"
                                      : "#c4c8d8",
                                  border:
                                    "1px solid rgba(255,255,255,0.1)",
                                }}
                              >
                                <option value="USER">
                                  USER
                                </option>

                                <option value="ADMIN">
                                  ADMIN
                                </option>
                              </select>
                            ) : (
                              <RoleBadge
                                role={
                                  item.role
                                }
                              />
                            )}

                            {isUpdating && (
                              <span
                                className="ml-2 text-[10px]"
                                style={{
                                  color:
                                    "#8892a4",
                                }}
                              >
                                Actualizando...
                              </span>
                            )}
                          </td>

                          <td
                            className="px-4 py-3 text-[13px]"
                            style={{
                              color:
                                "#8892a4",
                            }}
                          >
                            {
                              item.createdAt
                            }
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <AlertDialog
        open={
          publicationToDelete !==
          null
        }
        onOpenChange={(
          open
        ) => {
          if (
            !open &&
            !deletingPublication
          ) {
            setPublicationToDelete(
              null
            );
          }
        }}
      >
        <AlertDialogContent
          style={{
            background:
              "#161b27",
            border:
              "1px solid rgba(255,255,255,0.1)",
            color:
              "#e8eaf0",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Eliminar publicación?
            </AlertDialogTitle>

            <AlertDialogDescription
              style={{
                color:
                  "#8892a4",
              }}
            >
              Estás a punto de eliminar{" "}
              <strong
                style={{
                  color:
                    "#e8eaf0",
                }}
              >
                {publicationToDelete?.albumName ||
                  publicationToDelete?.name}
              </strong>
              . Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={
                deletingPublication
              }
              style={{
                background:
                  "#1e2433",
                color:
                  "#c4c8d8",
                border:
                  "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={
                deletingPublication
              }
              onClick={
                handleDeletePublication
              }
              style={{
                background:
                  "#991b1b",
                color:
                  "#ffffff",
              }}
            >
              {deletingPublication
                ? "Eliminando..."
                : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg p-5 flex items-center justify-between"
      style={{
        background:
          "#161b27",
        border:
          "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div>
        <p
          className="text-[12px] uppercase tracking-wider mb-2"
          style={{
            color:
              "#8892a4",
          }}
        >
          {label}
        </p>

        <p
          className="text-3xl font-bold"
          style={{
            color:
              "#e8eaf0",
          }}
        >
          {value}
        </p>
      </div>

      <div
        style={{
          color:
            "#f59e0b",
        }}
      >
        {icon}
      </div>
    </div>
  );
}

function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder: string;
}) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded"
      style={{
        background:
          "#1e2433",
        border:
          "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Search
        size={14}
        style={{
          color:
            "#6f7890",
        }}
      />

      <input
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        placeholder={
          placeholder
        }
        className="bg-transparent outline-none text-[12px]"
        style={{
          color:
            "#e8eaf0",
        }}
      />
    </div>
  );
}

function RoleBadge({
  role,
}: {
  role: User["role"];
}) {
  const isSuperAdmin =
    role ===
    "SUPER_ADMIN";

  const isAdmin =
    role ===
    "ADMIN";

  return (
    <span
      className="inline-flex text-[12px] font-semibold px-3 py-1.5 rounded"
      style={{
        background:
          isSuperAdmin ||
          isAdmin
            ? "rgba(245,158,11,0.10)"
            : "#1e2433",
        color:
          isSuperAdmin ||
          isAdmin
            ? "#f59e0b"
            : "#c4c8d8",
        border:
          isSuperAdmin ||
          isAdmin
            ? "1px solid rgba(245,158,11,0.25)"
            : "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {role ===
      "SUPER_ADMIN"
        ? "SUPER ADMIN"
        : role}
    </span>
  );
}
