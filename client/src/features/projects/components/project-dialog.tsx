import { DialogClose } from '@radix-ui/react-dialog'
import { useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { type Dialect, dialectOptions } from 'shared'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createProject, updateProject } from '@/lib/client'

export enum ProjectDialogMode {
  Create = 'create',
  Edit = 'edit',
}

type Project = {
  id: string
  name: string
  description?: string
  dialect?: Dialect
}

type CommonProjectDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

type EditProjectDialogProps = CommonProjectDialogProps & {
  mode: ProjectDialogMode.Edit
  project: Project
}
type CreateProjectDialogProps = CommonProjectDialogProps & {
  mode: ProjectDialogMode.Create
}

type ProjectDialogProps = CreateProjectDialogProps | EditProjectDialogProps

type FormData = {
  name: string
  description?: string
  dialect: Dialect
}

export function ProjectDialog(props: ProjectDialogProps) {
  const mode = props.mode
  const form = useForm<FormData>({
    defaultValues: {
      name: mode === 'edit' ? props.project.name : '',
      description: mode === 'edit' ? props.project.description : '',
      dialect: mode === 'edit' ? props.project.dialect || 'general' : 'general',
    },
  })

  const router = useRouter()

  async function onSubmit(data: FormData) {
    switch (mode) {
      case ProjectDialogMode.Create:
        await createProject(data)
        break
      case ProjectDialogMode.Edit:
        await updateProject(props.project.id, data)
        break
    }
    router.invalidate()
    props.setOpen(false)
  }

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === ProjectDialogMode.Create
              ? 'Create New Project'
              : `Edit Project${props.project.name}`}
          </DialogTitle>
          <DialogDescription>
            {mode === ProjectDialogMode.Create
              ? 'Create a new project to start designing your database.'
              : `Edit the details of the project '${props.project.name}'.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dialect"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database dialect</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a dialect" />
                      </SelectTrigger>
                      <SelectContent>
                        {dialectOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" variant="default" onClick={form.handleSubmit(onSubmit)}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
