import { useEffect } from "react";
import { SquareKanban } from "lucide-react";
import { Navigate } from "react-router-dom";

import {
  DndContext,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";

import { ROUTES } from "@/types/routes";

import useBoardStore from "@/store/useBoardStore";
import useAuthStore from "@/store/useAuthStore";
import useUsersStore from "@/store/useUsersStore";
import useBoardDragAndDrop from "@/hooks/useBoardDragAndDrop";

import Surface from "@/components/shared/Surface";
import BoardColumn from "./BoardColumn";

const BoardPage = () => {
  const currentUser = useAuthStore((state) => state.currentUser);

  const logout = useAuthStore((state) => state.logout);

  const { cards, columns, loading, fetchBoard } = useBoardStore();

  const { users, loading: usersLoading, fetchUsers } = useUsersStore();

  const { activeCard, handleDragStart, handleDragEnd, handleDragCancel } =
    useBoardDragAndDrop();

  useEffect(() => {
    fetchBoard();
    fetchUsers();
  }, [fetchBoard, fetchUsers]);

  if (!currentUser) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (loading || usersLoading) {
    return <p>Loading board...</p>;
  }

  const activeAssignee =
    activeCard?.assigneeId != null
      ? users.find((user) => user.id === activeCard.assigneeId)
      : undefined;

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="board-page">
        <Surface className="board-header">
          <div className="board-header__brand">
            <div className="board-header__icon">
              <SquareKanban size={32} />
            </div>

            <h1>My Kanban</h1>
          </div>

          <div className="board-header__actions">
            <div className="user">
              <div
                className="user__avatar"
                style={{
                  backgroundColor: currentUser.color,
                }}
              >
                {currentUser.name[0]}
              </div>

              <span className="user__name">{currentUser.name}</span>

              <button className="user__logout" onClick={logout}>
                Exit
              </button>
            </div>
          </div>
        </Surface>

        <Surface className="board">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              cards={cards.filter((card) => card.columnId === column.id)}
              users={users}
            />
          ))}
        </Surface>
      </div>

      <DragOverlay>
        {activeCard && (
          <div className="card">
            <div className="card__header">
              <h3 className="card__title">{activeCard.title}</h3>
            </div>

            <div>
              <p className="card__description">{activeCard.description}</p>

              <footer className="card__footer">
                <span>#{activeCard.order}</span>

                {activeAssignee && (
                  <div
                    className="card__avatar"
                    style={{
                      backgroundColor: activeAssignee.color,
                    }}
                    title={activeAssignee.name}
                  >
                    {activeAssignee.name[0]}
                  </div>
                )}
              </footer>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default BoardPage;
