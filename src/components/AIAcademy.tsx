import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, GraduationCap } from 'lucide-react'

export default function AIAcademy() {
  const [courses] = useState([
    { id: '1', title: 'Digital Marketing 101', progress: 65 },
    { id: '2', title: 'Social Media Strategy', progress: 30 },
    { id: '3', title: 'E-Commerce Basics', progress: 100 },
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" /> AI Academy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {courses.map((c) => (
            <div key={c.id} className="flex items-center gap-3">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm">{c.title}</span>
              <span className="text-xs text-muted-foreground">{c.progress}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}