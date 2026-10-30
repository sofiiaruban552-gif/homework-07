import { useEffect, useState } from "react";
import { SquareKanban } from "lucide-react";

import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";

import useBoardStore from "@/store/useBoardStore";
import useAuthStore from "@/store/useAuthStore";
import useUsersStore from "@/store/useUsersStore";
import useBoardDragAndDrop from "@/hooks/useBoardDragAndDrop";

import Surface from "@/components/shared/Surface";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import UserInfo from "@/components/shared/UserInfo";
import Input from "@/components/shared/Input";
import BoardColumn from "./BoardColumn";
import BoardCard from "./BoardCard";
import filterCards from "@/utils/filterCards";

const BoardPage = () => {
  const currentUser = useAuthStore((state) => state.currentUser);

  const logout = useAuthStore((state) => state.logout);

  const { cards, columns, loading, fetchBoard } = useBoardStore();

  const { users, loading: usersLoading, fetchUsers } = useUsersStore();

  const { activeCard, handleDragStart, handleDragEnd, handleDragCancel } =
    useBoardDragAndDrop();

  const [onlyMyIssues, setOnlyMyIssues] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchBoard();
    fetchUsers();
  }, [fetchBoard, fetchUsers]);

  if (!currentUser) {
    return null;
  }

 if (loading || usersLoading) {
   return (
     <div className="board-page__loading">
       <LoadingSpinner />
     </div>
   );
 }
  
  const filteredCards = filterCards(cards, {
    query,
    onlyMine: onlyMyIssues,
    userId: currentUser.id,
  });

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
            <Input
              id="board-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search issues..."
              className="board-search"
            />
            <label className="switch">
              <input
                type="checkbox"
                checked={onlyMyIssues}
                onChange={(event) => setOnlyMyIssues(event.target.checked)}
              />

              <span className="switch__slider" />

              <span className="switch__label">Only My Issues</span>
            </label>

            <div className="user">
              <UserInfo
                user={currentUser}
                avatarClassName="user__avatar"
                nameClassName="user__name"
              />

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
              cards={filteredCards.filter(
                (card) => card.columnId === column.id,
              )}
              users={users}
            />
          ))}
        </Surface>
      </div>

      <DragOverlay>
        {activeCard && (
          <BoardCard card={activeCard} assignee={activeAssignee} isOverlay />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default BoardPage;
