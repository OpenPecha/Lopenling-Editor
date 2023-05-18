import React, { FC } from "react";
import { ClientOnly } from "remix-utils";
interface FCButton extends React.HTMLAttributes<HTMLButtonElement> {
  label: string;
  disabled?: true | false | undefined;
  type: "submit" | "button" | "reset";
}

export const Button: FC<FCButton> = ({ label = "", ...props }) => {
  let color = props.type === "submit" ? "bg-green-400" : "bg-gray-300";
  let disabled = props.disabled === null ? false : props.disabled;
  let textColor = props.type === "submit" ? "text-white" : "text-black";
  return (
    <ClientOnly fallback="<button/>">
      {() => (
        <button
          className={`${color} ${textColor} cursor-pointer px-3 py-2 text-xs font-medium text-center  rounded-lg  focus:ring-4 focus:outline-none`}
          disabled={disabled}
          {...props}
        >
          {label}
        </button>
      )}
    </ClientOnly>
  );
};
