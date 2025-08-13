import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";
import {
  DeleteConfirmationDialog,
  type DeleteConfirmationDialogProps,
} from "./delete-dialog.tsx";

const mockProps: Required<DeleteConfirmationDialogProps> = {
  onOpenChange: vi.fn(),
  onConfirm: vi.fn(),
  open: true,
  title: "Delete Item",
  itemName: "Test Item",
  description: "Are you sure you want to delete this item?",
  isLoading: false,
};

test("should render correctly ", () => {
  const { getByText, getByRole } = render(
    <DeleteConfirmationDialog {...mockProps} />,
  );

  expect(getByText(mockProps.title)).toBeInTheDocument();
  expect(getByText(mockProps.description)).toBeInTheDocument();

  const deleteButton = getByRole("button", { name: "Delete" });
  expect(deleteButton).toBeInTheDocument();

  const cancelButton = getByRole("button", { name: "Cancel" });
  expect(cancelButton).toBeInTheDocument();
});

test("should call onConfirm when delete button is clicked", async () => {
  const { getByRole } = render(<DeleteConfirmationDialog {...mockProps} />);

  const deleteButton = getByRole("button", { name: "Delete" });
  const confirmInput = screen.getByRole("textbox");
  await userEvent.type(confirmInput, "Delete");
  await userEvent.click(deleteButton);

  expect(mockProps.onConfirm).toHaveBeenCalled();
});
