import React from 'react'

interface DeleteConfirmationDialogProps {
  onDelete: () => void;
  onCancel: () => void;
  text:string;
  deleteButtonText:string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  onDelete,
  onCancel,
  text,
  deleteButtonText
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>
          {text}
        </p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onDelete}
            className="px-4 py-2 mr-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            {deleteButtonText}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;
