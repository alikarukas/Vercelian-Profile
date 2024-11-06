'use client'

import { useState } from 'react'
import { Plus, ChevronDown, ChevronRight, Calendar, CheckCircle2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Task = {
  id: number
  title: string
  completed: boolean
}

type Event = {
  id: number
  title: string
  date: string
  tasks: Task[]
}

export default function Component() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Annual Conference",
      date: "2024-06-15",
      tasks: [
        { id: 1, title: "Book venue", completed: true },
        { id: 2, title: "Send invitations", completed: false },
        { id: 3, title: "Arrange catering", completed: false },
      ]
    },
    {
      id: 2,
      title: "Product Launch",
      date: "2024-08-01",
      tasks: [
        { id: 1, title: "Finalize product details", completed: true },
        { id: 2, title: "Prepare marketing materials", completed: true },
        { id: 3, title: "Set up online store", completed: false },
      ]
    }
  ])

  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventDate, setNewEventDate] = useState("")

  const addEvent = () => {
    if (newEventTitle && newEventDate) {
      setEvents([...events, {
        id: events.length + 1,
        title: newEventTitle,
        date: newEventDate,
        tasks: []
      }])
      setNewEventTitle("")
      setNewEventDate("")
    }
  }

  const addTask = (eventId: number, taskTitle: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          tasks: [...event.tasks, {
            id: event.tasks.length + 1,
            title: taskTitle,
            completed: false
          }]
        }
      }
      return event
    }))
  }

  const toggleTask = (eventId: number, taskId: number) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          tasks: event.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        }
      }
      return event
    }))
  }

  const calculateProgress = (tasks: Task[]) => {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter(task => task.completed).length
    return (completedTasks / tasks.length) * 100
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event Project Manager</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Event Title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
            />
            <Input
              type="date"
              value={newEventDate}
              onChange={(e) => setNewEventDate(e.target.value)}
            />
            <Button onClick={addEvent}>
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </div>
        </CardContent>
      </Card>

      {events.map(event => (
        <Collapsible key={event.id} className="mb-4">
          <Card>
            <CardHeader>
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <CardTitle>{event.title}</CardTitle>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CardDescription className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> {event.date}
              </CardDescription>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <h3 className="font-semibold mb-2">Tasks</h3>
                <ul className="space-y-2">
                  {event.tasks.map(task => (
                    <li key={task.id} className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`mr-2 ${task.completed ? 'text-green-500' : 'text-gray-500'}`}
                        onClick={() => toggleTask(event.id, task.id)}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <Input
                    placeholder="New task"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTask(event.id, e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">{Math.round(calculateProgress(event.tasks))}%</span>
                  </div>
                  <Progress value={calculateProgress(event.tasks)} className="w-full" />
                </div>
              </CardFooter>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  )
}
