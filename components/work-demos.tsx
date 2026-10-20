'use client';

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  LayoutGrid,
  List,
  MapPin,
  Plus,
  RotateCcw,
  X,
} from 'lucide-react';

function DemoDialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
    return () => {
      if (element.open) element.close();
    };
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className="work-demo-dialog"
      aria-labelledby={id}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="work-demo-dialog-head">
        <h4 id={id}>{title}</h4>
        <button type="button" onClick={onClose} aria-label="Close dialog">
          <X size={19} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
function DemoFrame({
  brand,
  kind,
  children,
  aside,
  onReset,
}: {
  brand: string;
  kind: string;
  children: ReactNode;
  aside: ReactNode;
  onReset: () => void;
}) {
  return (
    <div className={`work-demo work-demo-${brand.toLowerCase()}`}>
      <div className="demo-window">
        <span className="demo-window-dots">
          <i />
          <i />
          <i />
        </span>
        <span>
          {brand} <span className="demo-window-divider">/</span> {kind}
        </span>
        <span className="demo-window-label">Interactive concept</span>
      </div>
      <div className="demo-app">
        <aside className="demo-sidebar">
          <div className="demo-brand">
            {brand.toLowerCase()}
            <span>.</span>
          </div>
          <span className="demo-workspace-label">STUDIO WORKSPACE</span>
          {aside}
          <div className="demo-sidebar-foot">
            <span className="demo-online-dot" />
            Sample workspace
          </div>
        </aside>
        <div className="demo-main">{children}</div>
      </div>
      <div className="demo-footer">
        <span>Fictional business · Changes stay in this demo</span>
        <button type="button" onClick={onReset}>
          <RotateCcw size={12} />
          Reset demo
        </button>
      </div>
    </div>
  );
}

type Appointment = {
  id: number;
  name: string;
  service: string;
  day: number;
  start: string;
  duration: number;
  tone: string;
  location: string;
};
const days = [
  'Monday, 19 October',
  'Tuesday, 20 October',
  'Wednesday, 21 October',
  'Thursday, 22 October',
  'Friday, 23 October',
];
const initialAppointments: Appointment[] = [
  {
    id: 1,
    name: 'Avery Stone',
    service: 'Consultation',
    day: 1,
    start: '09:00',
    duration: 60,
    tone: 'sage',
    location: 'Studio one',
  },
  {
    id: 2,
    name: 'Jordan Lee',
    service: 'Site visit',
    day: 1,
    start: '11:00',
    duration: 90,
    tone: 'sand',
    location: 'On site',
  },
  {
    id: 3,
    name: 'Riley Brooks',
    service: 'Studio session',
    day: 2,
    start: '10:00',
    duration: 120,
    tone: 'clay',
    location: 'Studio one',
  },
  {
    id: 4,
    name: 'Morgan Ellis',
    service: 'Project review',
    day: 3,
    start: '14:00',
    duration: 60,
    tone: 'sage',
    location: 'Video call',
  },
  {
    id: 5,
    name: 'Sam Taylor',
    service: 'Consultation',
    day: 0,
    start: '13:00',
    duration: 60,
    tone: 'sand',
    location: 'Studio one',
  },
];
const minutes = (value: string) => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};
const clock = (value: number) =>
  `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
const timeRange = (appointment: Appointment) =>
  `${appointment.start}–${clock(minutes(appointment.start) + appointment.duration)}`;

export function DaylightDemo() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selected, setSelected] = useState<number | null>(2);
  const [view, setView] = useState<'week' | 'list'>('week');
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState('');
  const [formError, setFormError] = useState('');
  const appointment = appointments.find((item) => item.id === selected);
  const today = appointments.filter((item) => item.day === 1);
  const booked = today.reduce((sum, item) => sum + item.duration, 0);
  function reset() {
    setAppointments(initialAppointments);
    setSelected(2);
    setView('week');
    setAdding(false);
    setNotice('Demo reset.');
  }
  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const customer = String(data.get('name')).trim();
    if (!customer) {
      setFormError('Enter a customer name.');
      return;
    }
    const day = Number(data.get('day')),
      start = String(data.get('start')),
      duration = Number(data.get('duration'));
    const begin = minutes(start),
      end = begin + duration;
    if (begin < 480 || end > 1020) {
      setFormError('Choose a time between 08:00 and 17:00.');
      return;
    }
    if (
      appointments.some(
        (item) =>
          item.day === day &&
          begin < minutes(item.start) + item.duration &&
          end > minutes(item.start)
      )
    ) {
      setFormError('That time overlaps an appointment. Choose another time.');
      return;
    }
    const item: Appointment = {
      id: Math.max(0, ...appointments.map((item) => item.id)) + 1,
      name: customer,
      service: String(data.get('service')),
      day,
      start,
      duration,
      tone: data.get('service') === 'Site visit' ? 'sand' : 'sage',
      location:
        data.get('service') === 'Site visit'
          ? 'On site'
          : data.get('service') === 'Project review'
            ? 'Video call'
            : 'Studio one',
    };
    setAppointments((items) => [...items, item]);
    setSelected(item.id);
    setAdding(false);
    setNotice(`${item.name} booked for ${days[day]} at ${start}.`);
    setFormError('');
  }
  return (
    <DemoFrame
      brand="Daylight"
      kind="Calendar"
      onReset={reset}
      aside={
        <>
          <div className="demo-sidebar-current">
            <CalendarDays size={17} />
            Calendar
          </div>
          <div className="demo-sidebar-note">
            <span>TODAY, AT A GLANCE</span>
            <strong>{today.length} appointments</strong>
            <p>
              Tuesday, 20 October
              <br />
              Space for the good work.
            </p>
          </div>
          <div className="demo-sidebar-legend">
            <span>
              <i className="demo-legend-sage" />
              Consultations & reviews
            </span>
            <span>
              <i className="demo-legend-sand" />
              Site visits
            </span>
            <span>
              <i className="demo-legend-clay" />
              Studio sessions
            </span>
          </div>
        </>
      }
    >
      <div className="demo-main-heading">
        <div>
          <p>YOUR CALENDAR</p>
          <h4>A well-planned week.</h4>
          <span>19–23 October 2026</span>
        </div>
        <button
          type="button"
          className="demo-button demo-button-primary"
          onClick={() => {
            setFormError('');
            setAdding(true);
          }}
        >
          <Plus size={15} />
          New appointment
        </button>
      </div>
      <div className="demo-stats">
        <div>
          <span>Today’s appointments</span>
          <strong>
            {String(today.length).padStart(2, '0')}
            <small>In the diary</small>
          </strong>
        </div>
        <div>
          <span>Time booked today</span>
          <strong>
            {booked / 60}
            <small>Hours, with room between</small>
          </strong>
        </div>
        <div>
          <span>This week</span>
          <strong>
            {String(appointments.length).padStart(2, '0')}
            <small>Appointments in view</small>
          </strong>
        </div>
      </div>
      <div className="demo-schedule-layout">
        <div className="demo-calendar-panel">
          <div className="demo-panel-heading">
            <h5>Your week</h5>
            <div className="demo-view-toggle" role="group" aria-label="Calendar view">
              <button
                type="button"
                aria-label="Week view"
                aria-pressed={view === 'week'}
                onClick={() => setView('week')}
              >
                <LayoutGrid size={13} />
                <span>Week</span>
              </button>
              <button
                type="button"
                aria-label="List view"
                aria-pressed={view === 'list'}
                onClick={() => setView('list')}
              >
                <List size={13} />
                <span>List</span>
              </button>
            </div>
          </div>
          <div
            className={`demo-calendar-view ${view === 'list' ? 'demo-calendar-list-selected' : ''}`}
          >
            <div className="demo-calendar-week">
              <div className="demo-calendar-day-head">
                <span />
                {['MON 19', 'TUE 20', 'WED 21', 'THU 22', 'FRI 23'].map((day, index) => (
                  <span key={day} className={index === 1 ? 'demo-today' : ''}>
                    {day}
                  </span>
                ))}
              </div>
              <div className="demo-calendar-grid">
                <div className="demo-time-ruler">
                  {Array.from({ length: 9 }, (_, index) => (
                    <span key={index} style={{ top: `${(index / 9) * 100}%` }}>
                      {String(index + 8).padStart(2, '0')}:00
                    </span>
                  ))}
                </div>
                {days.map((day, index) => (
                  <div
                    className={`demo-day-column ${index === 1 ? 'demo-day-today' : ''}`}
                    key={day}
                  >
                    {appointments
                      .filter((item) => item.day === index)
                      .map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          className={`demo-appointment demo-tone-${item.tone} ${selected === item.id ? 'demo-appointment-selected' : ''}`}
                          style={{
                            top: `${((minutes(item.start) - 480) / 540) * 100}%`,
                            height: `${(item.duration / 540) * 100}%`,
                          }}
                          onClick={() => setSelected(item.id)}
                          aria-label={`View ${item.name}, ${item.service}, ${day}, ${timeRange(item)}`}
                        >
                          <strong>{item.name}</strong>
                          <span>{item.service}</span>
                          {item.duration >= 90 && <small>{timeRange(item)}</small>}
                        </button>
                      ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="demo-appointment-list">
              {[...appointments]
                .sort((a, b) => a.day - b.day || minutes(a.start) - minutes(b.start))
                .map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelected(item.id)}
                    className={selected === item.id ? 'demo-list-active' : ''}
                  >
                    <span>
                      <strong>{item.name}</strong>
                      <small>
                        {item.service} · {days[item.day].split(',')[0]}
                      </small>
                    </span>
                    <span>
                      {item.start}
                      <ArrowUpRight size={14} />
                    </span>
                  </button>
                ))}
              {!appointments.length && (
                <p className="demo-empty">
                  Your calendar is clear. Add an appointment to get started.
                </p>
              )}
            </div>
          </div>
        </div>
        <aside className="demo-appointment-detail">
          <p className="demo-small-label">APPOINTMENT DETAILS</p>
          {appointment ? (
            <>
              <span className="demo-person-initials">
                {appointment.name
                  .split(' ')
                  .map((word) => word[0])
                  .join('')}
              </span>
              <h5>{appointment.name}</h5>
              <p className="demo-detail-service">{appointment.service}</p>
              <span className="demo-confirmed">
                <CheckCircle2 size={12} />
                Confirmed
              </span>
              <div className="demo-detail-facts">
                <p>
                  <CalendarDays size={14} />
                  <span>{days[appointment.day]}</span>
                </p>
                <p>
                  <Clock3 size={14} />
                  <span>
                    {timeRange(appointment)}
                    <small>{appointment.duration} minutes</small>
                  </span>
                </p>
                <p>
                  <MapPin size={14} />
                  <span>{appointment.location}</span>
                </p>
              </div>
              <button
                type="button"
                className="demo-cancel-appointment"
                onClick={() => {
                  setAppointments((items) => items.filter((item) => item.id !== appointment.id));
                  setSelected(null);
                  setNotice(`${appointment.name}’s appointment cancelled.`);
                }}
              >
                Cancel appointment
              </button>
            </>
          ) : (
            <p className="demo-empty">Select an appointment to see the details.</p>
          )}
        </aside>
      </div>
      <p className="demo-live-status" role="status">
        {notice || 'Select an appointment to take a closer look.'}
      </p>
      <DemoDialog open={adding} onClose={() => setAdding(false)} title="New appointment">
        <form className="demo-form" onSubmit={add}>
          <label>
            Customer name
            <input name="name" required maxLength={70} placeholder="e.g. Jamie Taylor" />
          </label>
          <label>
            Service
            <select name="service">
              <option>Consultation</option>
              <option>Site visit</option>
              <option>Project review</option>
            </select>
          </label>
          <label>
            Day
            <select name="day" defaultValue="1">
              {days.map((day, index) => (
                <option value={index} key={day}>
                  {day}
                </option>
              ))}
            </select>
          </label>
          <div className="demo-form-row">
            <label>
              Start time
              <input
                type="time"
                name="start"
                defaultValue="14:00"
                min="08:00"
                max="16:30"
                required
              />
            </label>
            <label>
              Duration
              <select name="duration" defaultValue="60">
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1½ hours</option>
              </select>
            </label>
          </div>
          {formError && (
            <p className="demo-form-error" role="alert">
              {formError}
            </p>
          )}
          <p className="demo-form-note">Sample data only. No booking or message is sent.</p>
          <button type="submit" className="demo-button demo-button-primary">
            Save appointment
            <Check size={15} />
          </button>
        </form>
      </DemoDialog>
    </DemoFrame>
  );
}

type Stage = 'To do' | 'In progress' | 'Done';
type Task = {
  id: number;
  title: string;
  project: 'Website' | 'Operations';
  owner: string;
  due: string;
  stage: Stage;
  note: string;
};
const stages: Stage[] = ['To do', 'In progress', 'Done'];
const people = ['Alex Morgan', 'Jordan Lee', 'Riley Brooks'];
const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Review homepage copy',
    project: 'Website',
    owner: 'Alex Morgan',
    due: 'Today',
    stage: 'To do',
    note: 'Check the final wording for the home and contact pages.',
  },
  {
    id: 2,
    title: 'Confirm content outline',
    project: 'Website',
    owner: 'Jordan Lee',
    due: 'Tomorrow',
    stage: 'To do',
    note: 'Agree the page structure before the next design review.',
  },
  {
    id: 3,
    title: 'Build enquiry form',
    project: 'Website',
    owner: 'Riley Brooks',
    due: 'Today',
    stage: 'In progress',
    note: 'Connect the enquiry fields and check the confirmation state.',
  },
  {
    id: 4,
    title: 'Set up reminder flow',
    project: 'Operations',
    owner: 'Alex Morgan',
    due: 'Tomorrow',
    stage: 'In progress',
    note: 'Keep the next follow-up visible after a quote is approved.',
  },
  {
    id: 5,
    title: 'Prepare launch checklist',
    project: 'Website',
    owner: 'Jordan Lee',
    due: 'This week',
    stage: 'Done',
    note: 'Review the content, forms and small-screen layout.',
  },
  {
    id: 6,
    title: 'Send handover guide',
    project: 'Operations',
    owner: 'Riley Brooks',
    due: 'This week',
    stage: 'Done',
    note: 'Bring the key links and next steps into one short guide.',
  },
];
export function RelayDemo() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState('All work');
  const [editing, setEditing] = useState<Task | null>(null);
  const [adding, setAdding] = useState<Stage | null>(null);
  const [notice, setNotice] = useState('');
  const [formError, setFormError] = useState('');
  const visible = filter === 'All work' ? tasks : tasks.filter((task) => task.project === filter);
  const done = visible.filter((task) => task.stage === 'Done').length;
  function reset() {
    setTasks(initialTasks);
    setFilter('All work');
    setEditing(null);
    setAdding(null);
    setNotice('Demo reset.');
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get('title')).trim();
    if (!title) {
      setFormError('Enter a task title.');
      return;
    }
    const item: Task = {
      id: editing?.id ?? Math.max(0, ...tasks.map((task) => task.id)) + 1,
      title,
      project: String(data.get('project')) as Task['project'],
      owner: String(data.get('owner')),
      due: String(data.get('due')),
      stage: String(data.get('stage')) as Stage,
      note: String(data.get('note')).trim(),
    };
    setTasks((items) =>
      editing ? items.map((task) => (task.id === item.id ? item : task)) : [...items, item]
    );
    setNotice(`${item.title} saved in ${item.stage}.`);
    if (filter !== 'All work' && filter !== item.project) setFilter(item.project);
    setFormError('');
    setEditing(null);
    setAdding(null);
  }
  return (
    <DemoFrame
      brand="Relay"
      kind="Project board"
      onReset={reset}
      aside={
        <>
          <div className="demo-sidebar-current">
            <LayoutGrid size={17} />
            Project board
          </div>
          <p className="demo-filter-label">PROJECTS</p>
          <div className="demo-project-filters" role="group" aria-label="Filter projects">
            {['All work', 'Website', 'Operations'].map((name) => (
              <button
                type="button"
                key={name}
                className={filter === name ? 'demo-project-filter-active' : ''}
                onClick={() => setFilter(name)}
                aria-pressed={filter === name}
              >
                <span
                  className={`demo-project-dot demo-project-${name.toLowerCase().replace(' ', '-')}`}
                />
                {name}
                <span>
                  {name === 'All work'
                    ? tasks.length
                    : tasks.filter((task) => task.project === name).length}
                </span>
              </button>
            ))}
          </div>
          <div className="demo-sidebar-note">
            <span>A SHARED VIEW</span>
            <strong>
              Clear owners.
              <br />
              Visible next steps.
            </strong>
            <p>The small details that keep a handover moving.</p>
          </div>
        </>
      }
    >
      <div className="demo-main-heading">
        <div>
          <p>YOUR WORKSPACE</p>
          <h4>Project board</h4>
          <span>Every task, with a clear owner and next step.</span>
        </div>
        <button
          type="button"
          className="demo-button demo-button-primary"
          onClick={() => {
            setFormError('');
            setAdding('To do');
          }}
        >
          <Plus size={15} />
          Add task
        </button>
      </div>
      <div className="demo-stats">
        <div>
          <span>Open tasks</span>
          <strong>
            {String(visible.length - done).padStart(2, '0')}
            <small>Still to work through</small>
          </strong>
        </div>
        <div>
          <span>In progress</span>
          <strong>
            {String(visible.filter((task) => task.stage === 'In progress').length).padStart(2, '0')}
            <small>Being worked on</small>
          </strong>
        </div>
        <div>
          <span>Completed</span>
          <strong>
            {String(done).padStart(2, '0')}
            <small>Ready for what’s next</small>
          </strong>
        </div>
      </div>
      <label className="demo-mobile-filter">
        Project
        <select
          aria-label="Filter projects"
          value={filter}
          onChange={(event) => setFilter(event.currentTarget.value)}
        >
          <option>All work</option>
          <option>Website</option>
          <option>Operations</option>
        </select>
      </label>
      <div className="demo-board">
        {stages.map((stage) => (
          <section className="demo-board-column" key={stage} aria-label={`${stage} tasks`}>
            <div className="demo-board-column-heading">
              <h5>
                <i
                  className={`demo-stage-dot demo-stage-${stage.toLowerCase().replaceAll(' ', '-')}`}
                />
                {stage}
              </h5>
              <span>{visible.filter((task) => task.stage === stage).length}</span>
            </div>
            <div className="demo-task-list">
              {visible
                .filter((task) => task.stage === stage)
                .map((task) => (
                  <button
                    type="button"
                    className="demo-task"
                    key={task.id}
                    onClick={() => {
                      setFormError('');
                      setEditing(task);
                    }}
                    aria-label={`Open task: ${task.title}`}
                  >
                    <span className="demo-task-project">
                      <i
                        className={`demo-project-dot demo-project-${task.project.toLowerCase()}`}
                      />
                      {task.project}
                      <ArrowUpRight size={13} />
                    </span>
                    <strong>{task.title}</strong>
                    <p>{task.note}</p>
                    <span className="demo-task-footer">
                      <span className="demo-owner">
                        <i>
                          {task.owner
                            .split(' ')
                            .map((word) => word[0])
                            .join('')}
                        </i>
                        <span>{task.owner.split(' ')[0]}</span>
                      </span>
                      <span
                        className={task.due === 'Today' && stage !== 'Done' ? 'demo-due-today' : ''}
                      >
                        {task.due}
                      </span>
                    </span>
                  </button>
                ))}
            </div>
            <button
              type="button"
              className="demo-add-column-task"
              onClick={() => {
                setFormError('');
                setAdding(stage);
              }}
              aria-label={`Add task to ${stage}`}
            >
              <Plus size={13} />
              Add task
            </button>
          </section>
        ))}
      </div>
      <p className="demo-live-status" role="status">
        {notice || 'Open a task to update its owner, due date or status.'}
      </p>
      <DemoDialog
        open={Boolean(editing || adding)}
        onClose={() => {
          setEditing(null);
          setAdding(null);
        }}
        title={editing ? 'Task details' : 'Add a task'}
      >
        <form className="demo-form" onSubmit={save} key={editing?.id ?? `new-${adding}`}>
          <label>
            Task title
            <input
              name="title"
              defaultValue={editing?.title ?? ''}
              placeholder="What needs doing?"
              required
              maxLength={90}
            />
          </label>
          <div className="demo-form-row">
            <label>
              Project
              <select
                name="project"
                defaultValue={
                  editing?.project ?? (filter === 'Operations' ? 'Operations' : 'Website')
                }
              >
                <option>Website</option>
                <option>Operations</option>
              </select>
            </label>
            <label>
              Status
              <select name="stage" defaultValue={editing?.stage ?? adding ?? 'To do'}>
                {stages.map((stage) => (
                  <option key={stage}>{stage}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="demo-form-row">
            <label>
              Owner
              <select name="owner" defaultValue={editing?.owner ?? people[0]}>
                {people.map((person) => (
                  <option key={person}>{person}</option>
                ))}
              </select>
            </label>
            <label>
              Due
              <select name="due" defaultValue={editing?.due ?? 'Tomorrow'}>
                <option>Today</option>
                <option>Tomorrow</option>
                <option>This week</option>
              </select>
            </label>
          </div>
          <label>
            Details
            <textarea
              name="note"
              rows={3}
              defaultValue={editing?.note ?? ''}
              maxLength={500}
              placeholder="A little context for the next person."
            />
          </label>
          {formError && (
            <p className="demo-form-error" role="alert">
              {formError}
            </p>
          )}
          <p className="demo-form-note">Sample data only. Changes stay in this local preview.</p>
          <button type="submit" className="demo-button demo-button-primary">
            Save task
            <Check size={15} />
          </button>
        </form>
      </DemoDialog>
    </DemoFrame>
  );
}
