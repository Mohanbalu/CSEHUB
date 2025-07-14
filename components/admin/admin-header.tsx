"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Shield } from "lucide-react"

interface AdminHeaderProps {
  title: string
  description: string
  onAddNew: () => void
  addButtonText: string
  itemCount?: number
}

export function AdminHeader({ title, description, onAddNew, addButtonText, itemCount }: AdminHeaderProps) {
  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-orange-900">Admin Mode</h2>
                <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                  {itemCount !== undefined ? `${itemCount} items` : "Management"}
                </Badge>
              </div>
              <p className="text-sm text-orange-700">You can create, edit, and manage {title.toLowerCase()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={onAddNew} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              {addButtonText}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
