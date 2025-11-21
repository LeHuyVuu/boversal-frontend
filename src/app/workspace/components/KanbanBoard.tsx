'use client';
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  closestCenter,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types/task';
import { TaskCard } from '@/app/workspace/components/TaskCard';
import { TaskDetail } from './TaskDetail';

const mockTasks: Task[] = [
  {
    id: '1',
    projectId: {
      id: 'p1',
      name: 'Project Alpha',
      description: 'Demo project',
      status: 'active',
      startDate: null,
      endDate: null,
      progress: 50,
    },
    name: 'Design UI',
    description: 'Create wireframes and mockups',
    status: 'To Do',
    priority: 'Medium',
    dueDate: '2025-10-01T00:00:00.000Z',
    createdBy: {
      id: 'u1',
      email: 'alice@example.com',
      fullName: 'Alice Johnson',
      avatar: 'https://i.pravatar.cc/40?img=1',
    },
  },
  {
    id: '2',
    projectId: {
      id: 'p1',
      name: 'Project Alpha',
      description: 'Demo project',
      status: 'active',
      startDate: null,
      endDate: null,
      progress: 50,
    },
    name: 'Implement API',
    description: 'Build REST API for tasks',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2025-10-05T00:00:00.000Z',
    createdBy: {
      id: 'u2',
      email: 'bob@example.com',
      fullName: 'Bob Smith',
      avatar: 'https://i.pravatar.cc/40?img=2',
    },
  },
  {
    id: '3',
    projectId: {
      id: 'p2',
      name: 'Project Beta',
      description: 'Another demo',
      status: 'active',
      startDate: null,
      endDate: null,
      progress: 80,
    },
    name: 'Write Tests',
    description: 'Unit and integration tests',
    status: 'Review',
    priority: 'Low',
    dueDate: '2025-10-10T00:00:00.000Z',
    createdBy: {
      id: 'u3',
      email: 'charlie@example.com',
      fullName: 'Charlie Nguyen',
      avatar: 'https://i.pravatar.cc/40?img=3',
    },
  },
];

const columns = [
  { id: 'To Do', label: 'To Do', color: 'border-slate-300' },
  { id: 'In Progress', label: 'In Progress', color: 'border-sky-300' },
  { id: 'Review', label: 'Review', color: 'border-yellow-300' },
  { id: 'Done', label: 'Done', color: 'border-emerald-300' },
] as const;

export const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [currentColumn, setCurrentColumn] = useState<string | null>(null);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const taskById = React.useMemo(
    () => new Map((tasks ?? []).map((t) => [t.id, t])),
    [tasks]
  );

  const handleDragStart = (e: DragStartEvent) => {
    const task = taskById.get(e.active.id as string);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isColumn = columns.some((c) => c.id === overId);
    if (isColumn) {
      const t = taskById.get(activeId);
      if (t && t.status !== overId) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === activeId ? { ...task, status: overId } : task
          )
        );
        return;
      }
    }

    const overTask = taskById.get(overId);
    const activeTaskData = taskById.get(activeId);
    if (overTask && activeTaskData && overTask.status !== activeTaskData.status) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === activeId ? { ...task, status: overTask.status } : task
        )
      );
    }
  };

  const statusMap: Record<string, string> = {
    'To Do': 'To Do',
    'In Progress': 'In Progress',
    Review: 'Review',
    Done: 'Done',
  };

  const handleAddTask = (taskData: Partial<Task>) => {
    if (!currentColumn) return;
    const newTask: Task = {
      id: Date.now().toString(),
      name: taskData.name || 'New Task',
      description: taskData.description || '',
      priority: taskData.priority || 'Medium',
      dueDate: taskData.dueDate || new Date().toISOString(),
      ...taskData,
      projectId: {
        id: 'p-new',
        name: 'Mock Project',
        description: '',
        status: 'active',
        startDate: null,
        endDate: null,
        progress: 0,
      },
      createdBy: {
        id: 'u-new',
        email: 'mock@example.com',
        fullName: 'Mock User',
        avatar: 'https://i.pravatar.cc/40?img=4',
      },
      status: statusMap[currentColumn],
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <div className="flex-1 p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTask(null)}
      >
        <div className="grid grid-cols-4 gap-6 h-full">
          {columns.map((column) => {
            const columnTasks = (tasks ?? []).filter(
              (task) => task.status === column.id
            );

            return (
              <div key={column.id} className="flex flex-col">
                <div
                  className={`border-t-3 ${column.color} bg-sky-50 rounded-t-lg px-4 py-3`}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-slate-700 text-sm">
                      {column.label}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
                        {columnTasks.length}
                      </span>
                      <button
                        onClick={() => {
                          setCurrentColumn(column.id);
                        }}
                        className="text-slate-500 hover:text-sky-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <ColumnDroppable id={column.id}>
                  <SortableContext
                    items={columnTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex-1 bg-white rounded-b-lg p-4 space-y-3 min-h-96 border border-t-0 border-slate-200 overflow-hidden">
                      {columnTasks.map((task) => (
                        <SortableTask
                          key={task.id}
                          task={task}
                          onClick={() => handleSelectTask(task)}
                        />
                      ))}
                      {columnTasks.length === 0 && (
                        <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-lg">
                          <p className="text-slate-500 text-sm">No tasks</p>
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </ColumnDroppable>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="shadow-lg rounded-lg bg-white">
              <TaskCard task={activeTask} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedTask && (
        <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
};

const ColumnDroppable: React.FC<React.PropsWithChildren<{ id: string }>> = ({
  id,
  children,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={isOver ? 'ring-2 ring-sky-300/50 rounded-b-lg' : ''}
    >
      {children}
    </div>
  );
};

const SortableTask: React.FC<{ task: Task; onClick: () => void }> = ({
  task,
  onClick,
}) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.2, 0, 0, 1)',
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    borderRadius: '0.5rem',
    zIndex: isDragging ? 50 : 'auto',
    background: 'white',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
    >
      <TaskCard task={task} onClick={onClick} />
    </div>
  );
};
