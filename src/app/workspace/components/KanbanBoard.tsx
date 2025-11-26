'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  closestCorners,
  pointerWithin,
  rectIntersection,
  useDroppable,
  DragOverlay,
  CollisionDetection,
} from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { taskService, Task } from '@/services/taskService';
import { TaskCard } from '@/app/workspace/components/TaskCard';
import { TaskDetail } from './TaskDetail';
import { CreateTaskModal } from './CreateTaskModal';
import EditTaskModal from './EditTaskModal';
import { useTheme } from '@/contexts/ThemeContext';

const columns = [
  { id: 6, label: 'To Do', color: 'border-slate-500' },
  { id: 7, label: 'In Progress', color: 'border-cyan-500' },
  { id: 9, label: 'Review', color: 'border-amber-500' },
  { id: 4, label: 'Done', color: 'border-emerald-500' },
] as const;

interface KanbanBoardProps {
  projectId?: number;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentColumn, setCurrentColumn] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overId, setOverId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalData, setCreateModalData] = useState<{
    statusId: number;
    statusName: string;
    orderIndex: number;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0,
      },
    })
  );

  // Custom collision detection with multiple strategies for better drop detection
  const customCollisionDetection: CollisionDetection = (args) => {
    // First try pointer within
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }

    // Then try rect intersection (more forgiving)
    const rectCollisions = rectIntersection(args);
    if (rectCollisions.length > 0) {
      return rectCollisions;
    }

    // Finally fall back to closest corners
    return closestCorners(args);
  };

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = projectId
          ? await taskService.getTasks(1, 100, projectId)
          : await taskService.getMyTasks(1, 100);

        if (response.success) {
          setTasks(response.data);
        } else {
          setError(response.message || 'Failed to load tasks');
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  // Handle opening create modal
  const handleOpenCreateModal = (statusId: number, statusName: string) => {
    const columnTasks = tasks.filter((task) => task.statusId === statusId);
    const orderIndex = columnTasks.length; // Add to end
    
    setCreateModalData({
      statusId,
      statusName,
      orderIndex
    });
    setShowCreateModal(true);
  };

  // Handle edit task
  const handleEditTask = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTask(task);
  };

  // Refresh tasks after creating
  const handleTaskCreated = async () => {
    try {
      const response = projectId
        ? await taskService.getTasks(1, 100, projectId)
        : await taskService.getMyTasks(1, 100);

      if (response.success) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh tasks:', error);
    }
  };

  const taskById = React.useMemo(
    () => new Map((tasks ?? []).map((t) => [t.id, t])),
    [tasks]
  );

  const handleDragStart = (e: DragStartEvent) => {
    const task = taskById.get(e.active.id as number);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { over } = e;
    if (over) {
      setOverId(over.id as number);
    }
  };

  // *** ĐÃ SỬA: kéo thả đúng vị trí người dùng thả ***
  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over, delta } = e;
    setActiveTask(null);
    setOverId(null);

    if (!over) return;

    const taskId = active.id as number;
    const targetId = over.id as number;
    const activeTaskData = taskById.get(taskId);

    if (!activeTaskData) return;

    const isColumn = columns.some((c) => c.id === targetId);
    const overTask = taskById.get(targetId);

    if (!isColumn && !overTask) {
      return;
    }

    const targetStatusId = isColumn ? targetId : overTask!.statusId;

    // Lấy tất cả task trong cột target (trừ task đang drag)
    const columnTasks = tasks
      .filter((t) => t.statusId === targetStatusId && t.id !== taskId)
      .sort((a, b) => a.orderIndex - b.orderIndex);

    let targetIndex: number;

    if (isColumn) {
      // Thả vào vùng cột → cho xuống cuối cột
      targetIndex = columnTasks.length;
    } else {
      // Thả lên 1 task khác → xác định index
      targetIndex = columnTasks.findIndex((t) => t.id === targetId);

      if (targetIndex === -1) {
        // fallback: nếu không tìm thấy thì add vào cuối
        targetIndex = columnTasks.length;
      } else {
        // Nếu người dùng kéo xuống dưới item → cho vào sau nó
        if (delta.y > 0) {
          targetIndex = targetIndex + 1;
        }
      }
    }

    const before = columnTasks[targetIndex - 1];
    const after = columnTasks[targetIndex];

    let newOrderIndex: number;

    if (!before && !after) {
      // Cột rỗng
      newOrderIndex = 1000;
    } else if (!before && after) {
      // Đầu cột
      newOrderIndex = after.orderIndex - 1;
    } else if (before && !after) {
      // Cuối cột
      newOrderIndex = before.orderIndex + 1;
    } else {
      // Ở giữa hai task
      newOrderIndex = Math.floor((before.orderIndex + after.orderIndex) / 2);
    }

    // Optimistic update KHÔNG sort lại tasks → giữ đúng vị trí theo orderIndex mới
    const prevTasks = tasks;
    const updatedTasks = prevTasks.map((t) =>
      t.id === taskId
        ? { ...t, statusId: targetStatusId, orderIndex: newOrderIndex }
        : t
    );

    setTasks(updatedTasks);

    // API call
    try {
      const payload: any = { orderIndex: newOrderIndex };
      if (targetStatusId !== activeTaskData.statusId) {
        payload.statusId = targetStatusId;
      }

      await taskService.patchTask(taskId, payload);
    } catch (error) {
      // Revert on error
      setTasks(prevTasks);
      // Silently fail - already reverted UI
    }
  };

  if (loading) {
    return (
      <div
        className={`flex-1 flex items-center justify-center ${
          theme === 'dark' ? 'bg-black' : 'bg-slate-50'
        }`}
      >
        <div className="text-center">
          <Loader2
            className={`w-12 h-12 animate-spin mx-auto mb-4 ${
              theme === 'dark' ? 'text-cyan-400' : 'text-sky-500'
            }`}
          />
          <p className={theme === 'dark' ? 'text-cyan-300' : 'text-slate-600'}>
            Loading tasks...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex-1 flex items-center justify-center ${
          theme === 'dark' ? 'bg-black' : 'bg-slate-50'
        }`}
      >
        <div className="text-center">
          <p
            className={`text-lg mb-2 ${
              theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`}
          >
            Error loading tasks
          </p>
          <p className={theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 p-3 sm:p-4 lg:p-6 ${
        theme === 'dark' ? 'bg-black' : 'bg-slate-50'
      }`}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          setActiveTask(null);
          setOverId(null);
        }}
      >
        {/* Mobile: Single column scroll */}
        <div className="block lg:hidden">
          <div className="flex flex-col gap-4">
            {columns.map((column) => {
              const columnTasks = (tasks ?? [])
                .filter((task) => task.statusId === column.id)
                .sort((a, b) => a.orderIndex - b.orderIndex);

              return (
                <ColumnDroppable
                  key={column.id}
                  id={column.id}
                  isOver={overId === column.id}
                >
                  <div className="flex flex-col w-full">
                    <div
                      className={`border-t-4 ${column.color} rounded-t-xl px-3 py-2.5 transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-900/60 border-b border-blue-500/20'
                          : 'bg-white border-b border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h2
                          className={`font-semibold text-sm ${
                            theme === 'dark'
                              ? 'text-cyan-100'
                              : 'text-slate-700'
                          }`}
                        >
                          {column.label}
                        </h2>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              theme === 'dark'
                                ? 'bg-blue-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {columnTasks.length}
                          </span>
                          <button
                            onClick={() => handleOpenCreateModal(column.id, column.label)}
                            className={`p-1.5 rounded-lg transition-all ${
                              theme === 'dark'
                                ? 'text-cyan-400 hover:text-cyan-300 hover:bg-blue-900/30'
                                : 'text-slate-500 hover:text-sky-600 hover:bg-sky-50'
                            }`}
                            title="Add task"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <SortableContext
                      items={columnTasks.map((t) => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div
                        className={`relative flex-1 rounded-b-xl p-3 space-y-2.5 border border-t-0 ${
                          columnTasks.length === 0
                            ? 'min-h-[350px]'
                            : 'min-h-[300px]'
                        } ${
                          theme === 'dark'
                            ? 'bg-slate-900/30 border-blue-500/20'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        {columnTasks.map((task) => (
                          <SortableTask
                            key={task.id}
                            task={task}
                            onClick={() => setSelectedTask(task)}
                            onEdit={handleEditTask}
                          />
                        ))}
                        {columnTasks.length === 0 && (
                          <div
                            className={`absolute inset-3 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all duration-200 pointer-events-none ${
                              overId === column.id
                                ? theme === 'dark'
                                  ? 'border-cyan-400/80 bg-cyan-500/20 shadow-lg shadow-cyan-500/30 scale-[1.02]'
                                  : 'border-sky-500/80 bg-sky-100 shadow-lg shadow-sky-500/30 scale-[1.02]'
                                : theme === 'dark'
                                ? 'border-blue-500/40 bg-slate-900/50'
                                : 'border-slate-300 bg-slate-100/50'
                            }`}
                          >
                            <div className="text-center">
                              <p
                                className={`text-sm font-medium mb-1 ${
                                  overId === column.id
                                    ? theme === 'dark'
                                      ? 'text-cyan-300'
                                      : 'text-sky-700'
                                    : theme === 'dark'
                                    ? 'text-cyan-400/60'
                                    : 'text-slate-400'
                                }`}
                              >
                                {overId === column.id
                                  ? '📥 Drop here'
                                  : 'No tasks'}
                              </p>
                              {overId !== column.id && (
                                <p
                                  className={`text-xs ${
                                    theme === 'dark'
                                      ? 'text-slate-500'
                                      : 'text-slate-400'
                                  }`}
                                >
                                  Drag tasks here
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </div>
                </ColumnDroppable>
              );
            })}
          </div>
        </div>

        {/* Desktop: Responsive grid without horizontal scroll */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-3 xl:gap-4">
          {columns.map((column) => {
            const columnTasks = (tasks ?? [])
              .filter((task) => task.statusId === column.id)
              .sort((a, b) => a.orderIndex - b.orderIndex);

            return (
              <ColumnDroppable
                key={column.id}
                id={column.id}
                isOver={overId === column.id}
              >
                <div className="flex flex-col">
                  <div
                    className={`border-t-4 ${column.color} rounded-t-xl px-3 py-2.5 transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-900/60 border-b border-blue-500/20'
                        : 'bg-white border-b border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h2
                        className={`font-semibold text-sm ${
                          theme === 'dark'
                            ? 'text-cyan-100'
                            : 'text-slate-700'
                        }`}
                      >
                        {column.label}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            theme === 'dark'
                              ? 'bg-blue-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {columnTasks.length}
                        </span>
                        <button
                          onClick={() => handleOpenCreateModal(column.id, column.label)}
                          className={`p-1.5 rounded-lg transition-all ${
                            theme === 'dark'
                              ? 'text-cyan-400 hover:text-cyan-300 hover:bg-blue-900/30'
                              : 'text-slate-500 hover:text-sky-600 hover:bg-sky-50'
                          }`}
                          title="Add task"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <SortableContext
                    items={columnTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div
                      className={`relative flex-1 rounded-b-xl p-3 space-y-2.5 max-h-[calc(100vh-300px)] border border-t-0 overflow-y-auto ${
                        columnTasks.length === 0
                          ? 'min-h-[450px]'
                          : 'min-h-[400px]'
                      } ${
                        theme === 'dark'
                          ? 'bg-slate-900/30 border-blue-500/20 scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-slate-800/50'
                          : 'bg-white border-slate-200 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'
                      }`}
                    >
                      {columnTasks.map((task) => (
                        <SortableTask
                          key={task.id}
                          task={task}
                          onClick={() => setSelectedTask(task)}
                          onEdit={handleEditTask}
                        />
                      ))}
                      {columnTasks.length === 0 && (
                        <div
                          className={`absolute inset-3 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all duration-200 pointer-events-none ${
                            overId === column.id
                              ? theme === 'dark'
                                ? 'border-cyan-400/80 bg-cyan-500/20 shadow-lg shadow-cyan-500/30 scale-[1.02]'
                                : 'border-sky-500/80 bg-sky-100 shadow-lg shadow-sky-500/30 scale-[1.02]'
                              : theme === 'dark'
                              ? 'border-blue-500/40 bg-slate-900/50'
                              : 'border-slate-300 bg-slate-100/50'
                          }`}
                        >
                          <div className="text-center">
                            <p
                              className={`text-base font-medium mb-1 ${
                                overId === column.id
                                  ? theme === 'dark'
                                    ? 'text-cyan-300'
                                    : 'text-sky-700'
                                  : theme === 'dark'
                                  ? 'text-cyan-400/70'
                                  : 'text-slate-400'
                              }`}
                            >
                              {overId === column.id
                                ? '📥 Drop here'
                                : 'No tasks'}
                            </p>
                            {overId !== column.id && (
                              <p
                                className={`text-xs ${
                                  theme === 'dark'
                                    ? 'text-slate-500'
                                    : 'text-slate-400'
                                }`}
                              >
                                Drag tasks here
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </div>
              </ColumnDroppable>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div
              className={`shadow-2xl rounded-lg ${
                theme === 'dark' ? 'bg-slate-800' : 'bg-white'
              }`}
            >
              <TaskCard task={activeTask} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}

      {/* Edit Task Modal */}
      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onSuccess={() => {
            handleTaskCreated();
            setEditTask(null);
          }}
        />
      )}

      {/* Create Task Modal */}
      {showCreateModal && createModalData && projectId && (
        <CreateTaskModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setCreateModalData(null);
          }}
          projectId={projectId}
          statusId={createModalData.statusId}
          statusName={createModalData.statusName}
          orderIndex={createModalData.orderIndex}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

const ColumnDroppable: React.FC<
  React.PropsWithChildren<{ id: number; isOver?: boolean }>
> = ({ id, children, isOver: isOverProp }) => {
  const { setNodeRef, isOver: isOverDroppable } = useDroppable({
    id,
    data: {
      type: 'column',
      columnId: id,
      accepts: ['task'],
    },
  });
  const { theme } = useTheme();
  const isOver = isOverProp || isOverDroppable;

  return (
    <div
      ref={setNodeRef}
      data-column-id={id}
      className={`transition-all duration-200 rounded-xl ${
        isOver
          ? theme === 'dark'
            ? 'ring-4 ring-cyan-400 bg-cyan-500/10 scale-[1.01]'
            : 'ring-4 ring-sky-500 bg-sky-100 scale-[1.01]'
          : ''
      }`}
      style={{
        minHeight: '500px',
      }}
    >
      {children}
    </div>
  );
};

const SortableTask: React.FC<{ 
  task: Task; 
  onClick: () => void;
  onEdit?: (task: Task, e: React.MouseEvent) => void;
}> = ({
  task,
  onClick,
  onEdit,
}) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
      statusId: task.statusId,
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    borderRadius: '0.75rem',
    zIndex: isDragging ? 999 : 'auto',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    touchAction: 'none',
    pointerEvents: isDragging ? 'none' : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? 'shadow-2xl ring-2 ring-cyan-400 scale-105' : ''}
    >
      <div
        onClick={onClick}
        style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
      >
        <TaskCard task={task} onClick={onClick} onEdit={onEdit} />
      </div>
    </div>
  );
};
