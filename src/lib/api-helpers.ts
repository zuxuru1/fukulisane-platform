import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

type ModelName = 'business' | 'project' | 'service' | 'testimonial' | 'quoteRequest' | 'lead' | 'invoice' | 'post' | 'socialLink' | 'order' | 'product' | 'connection' | 'leadActivity' | 'teamUser' | 'auditLog' | 'apiKey' | 'securitySetting' | 'systemMetric'

const prismaClient = prisma as any

export function createListHandler(model: ModelName) {
  return async (req: NextRequest) => {
    try {
      const { searchParams } = new URL(req.url)
      const take = parseInt(searchParams.get('take') || '50')
      const skip = parseInt(searchParams.get('skip') || '0')
      const where: Prisma.JsonObject = {}

      for (const [key, value] of searchParams.entries()) {
        if (!['take', 'skip', 'orderBy'].includes(key)) {
          where[key] = value
        }
      }

      const [items, total] = await Promise.all([
        prismaClient[model].findMany({ where, take, skip, orderBy: { createdAt: 'desc' } }),
        prismaClient[model].count({ where }),
      ])

      return NextResponse.json({ ok: true, items, total })
    } catch (error: any) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }
  }
}

export function createGetHandler(model: ModelName) {
  return async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const item = await prismaClient[model].findUnique({ where: { id: params.id } })
      if (!item) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
      return NextResponse.json({ ok: true, item })
    } catch (error: any) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }
  }
}

export function createCreateHandler(model: ModelName) {
  return async (req: NextRequest) => {
    try {
      const body = await req.json()
      const item = await prismaClient[model].create({ data: body })
      return NextResponse.json({ ok: true, item }, { status: 201 })
    } catch (error: any) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }
  }
}

export function createUpdateHandler(model: ModelName) {
  return async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const body = await req.json()
      const item = await prismaClient[model].update({ where: { id: params.id }, data: body })
      return NextResponse.json({ ok: true, item })
    } catch (error: any) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }
  }
}

export function createDeleteHandler(model: ModelName) {
  return async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
      await prismaClient[model].delete({ where: { id: params.id } })
      return NextResponse.json({ ok: true })
    } catch (error: any) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }
  }
}
