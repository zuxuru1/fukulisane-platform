import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wand2 } from 'lucide-react'

export default function AIGenerator() {
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState('')

  const generate = () => {
    setOutput(`AI-generated content for: ${prompt}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" /> AI Content Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <textarea
          className="w-full p-2 border rounded-md text-sm"
          placeholder="Describe what you want to create..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />
        <Button onClick={generate} size="sm">Generate</Button>
        {output && (
          <div className="p-3 bg-muted rounded-md text-sm">{output}</div>
        )}
      </CardContent>
    </Card>
  )
}