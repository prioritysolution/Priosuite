import { cn } from "@/lib/utils";
import { FaMapMarkedAlt } from "react-icons/fa";

const OperationalAreaCard = ({ label, active }) => {
  return (
    <div
      className={cn(
        " h-auto lg:w-full py-5 lg:h-full w-full px-5 flex flex-col justify-between items-center bg-secondary rounded-lg text-primary cursor-pointer text-center lg:gap-2",
        { "bg-primary text-white": active }
      )}
    >
      <p className="hidden sm:flex">
        <FaMapMarkedAlt />
      </p>
      <p>{label}</p>
    </div>
  );
};
export default OperationalAreaCard;
