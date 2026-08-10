import { useEffect } from "react";
import { SquareKanban } from "lucide-react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/types/routes";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import useBoardStore from "@/store/useBoardStore";
import useAuthStore from "@/store/useAuthStore";
import useUsersStore from "@/store/useUsersStore";

import Surface from "@/components/shared/Surface";
import BoardColumn from "./BoardColumn";

const BoardPage = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const { cards, columns, loading, fetchBoard } = useBoardStore();
  const { users, loading: usersLoading, fetchUsers } = useUsersStore();
  const moveCard = useBoardStore((s) => s.moveCard);

  const handleDragEnd = (event: DragEndEvent) => {
    const cardId = Number(event.active.id);
    const toColumn = Number(event.over?.id);
    if (!event.over) return; 
    moveCard(cardId, toColumn); 
  };

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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="board-page">
        <Surface className="board-header">
          <div className="board-header__brand">
            <div className="board-header__icon">
              <SquareKanban size={32} />
            </div>

            <h1>My Kanban</h1>
          </div>

          <div className="board-header__actions">
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="switch__slider" />
              <span className="switch__label">Only My Issues</span>
            </label>

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
    </DndContext>
  );
};

export default BoardPage;
