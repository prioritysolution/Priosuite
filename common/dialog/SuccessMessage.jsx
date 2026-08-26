"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { FaCheckCircle } from "react-icons/fa";

const SuccessMessage = ({
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  nextLabel = "Generate",
  showNextButton = false,
  handleNextButton,
}) => {
  return (
    <AlertDialog open={showSuccessMessage}>
      <AlertDialogContent>
        <div className="flex flex-col justify-center items-center gap-5 py-2">
          <FaCheckCircle className="text-5xl text-green-500 " />
          <p className="font-semibold text-xl">{successMessage}</p>
        </div>
        <AlertDialogFooter className="gap-1">
          <AlertDialogAction
            className="w-32 "
            onClick={handleCloseSuccessMessage}
          >
            Close
          </AlertDialogAction>
          {showNextButton && (
            <AlertDialogAction className="w-32" onClick={handleNextButton}>
              {nextLabel}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default SuccessMessage;
