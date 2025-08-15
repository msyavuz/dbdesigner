import { useFullscreen } from '@mantine/hooks'
import { act, renderHook } from '@testing-library/react'
import type { Design, ForeignKey, Table } from 'shared'
import { vi } from 'vitest'
import { useTheme } from '@/components/theme/theme-provider'
import { useDesign } from '@/hooks/use-design'
import { useWorkbench } from './use-workbench'

// Mock only the essential dependencies
vi.mock('@/components/theme/theme-provider')
vi.mock('@/hooks/use-design')
vi.mock('@mantine/hooks')

const mockDesign: Design = {
  id: 'design1',
  tables: [
    {
      id: 'table1',
      name: 'Users',
      position: { x: 100, y: 200 },
      columns: [
        {
          id: 'col1',
          name: 'id',
          type: 'integer',
          isNullable: false,
          isPrimaryKey: true,
        },
        {
          id: 'col2',
          name: 'name',
          type: 'text',
          isNullable: false,
          isPrimaryKey: false,
        },
      ],
    },
  ] as Table[],
  relationships: [] as ForeignKey[],
}

describe('useWorkbench', () => {
  const mockUpdateDesign = vi.fn()
  const mockToggleFullscreen = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useTheme).mockReturnValue({ theme: 'light', setTheme: vi.fn() })
    vi.mocked(useDesign).mockReturnValue({
      design: mockDesign,
      updateDesign: mockUpdateDesign,
    })
    vi.mocked(useFullscreen).mockReturnValue({
      toggle: mockToggleFullscreen,
      ref: vi.fn(),
      fullscreen: false,
    })
  })

  test('should initialize with correct default values', () => {
    const { result } = renderHook(() => useWorkbench())

    expect(result.current.theme).toBe('light')
    expect(result.current.nodes).toHaveLength(1)
    expect(result.current.edges).toHaveLength(0)
    expect(typeof result.current.onNodesChange).toBe('function')
    expect(typeof result.current.onEdgesChange).toBe('function')
    expect(typeof result.current.onConnect).toBe('function')
    expect(typeof result.current.saveDesign).toBe('function')
    expect(typeof result.current.toggleFullscreen).toBe('function')
  })

  test('should call updateDesign when saveDesign is called', () => {
    const { result } = renderHook(() => useWorkbench())

    act(() => {
      result.current.saveDesign()
    })

    expect(mockUpdateDesign).toHaveBeenCalled()
  })

  test('should call toggle when toggleFullscreen is called', () => {
    const { result } = renderHook(() => useWorkbench())

    act(() => {
      result.current.toggleFullscreen()
    })

    expect(mockToggleFullscreen).toHaveBeenCalled()
  })

  test('should not create connection when handles are invalid', () => {
    const { result } = renderHook(() => useWorkbench())

    act(() => {
      result.current.onConnect({
        source: 'table1',
        target: 'table2',
        sourceHandle: 'invalid',
        targetHandle: 'target.table2.col3',
      })
    })

    expect(mockUpdateDesign).not.toHaveBeenCalled()
  })

  test('should not create connection when source or target is missing', () => {
    const { result } = renderHook(() => useWorkbench())

    act(() => {
      result.current.onConnect({
        source: '',
        target: 'table2',
        sourceHandle: 'source.table1.col1',
        targetHandle: 'target.table2.col3',
      })
    })

    expect(mockUpdateDesign).not.toHaveBeenCalled()
  })

  test('should create connection with valid parameters', () => {
    const { result } = renderHook(() => useWorkbench())

    act(() => {
      result.current.onConnect({
        source: 'table1',
        target: 'table2',
        sourceHandle: 'source.table1.col1',
        targetHandle: 'target.table2.col3',
      })
    })

    expect(mockUpdateDesign).toHaveBeenCalledWith(
      expect.objectContaining({
        relationships: expect.arrayContaining([
          expect.objectContaining({
            fromTable: 'table1',
            fromColumn: 'col1',
            toTable: 'table2',
            toColumn: 'col3',
            onDelete: 'set null',
          }),
        ]),
      })
    )
  })
})
