import React from "react";

const FormField = ({
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
  placeholder = "",
  options = []
}) => (
  <div className="w-full relative gap-3">
    {console.log(value)}
    <label className="absolute top-0 left-3 -translate-y-3 bg-gray-50 px-2 font-medium z-10">
      {label}
    </label>

    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
      <Icon className="size-5 text-black/70 z-10" />
    </div>

    {type === "select" ? (
      <select
        className="w-full pl-10 py-4 bg-gray-50 rounded-2xl border-1"
        value={value}
        onChange={onChange}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt === "" ? "Wybierz…" : opt}
          </option>
        ))}
      </select>
    ) : type === "textarea" ? (
      <textarea
        className="w-full pl-10 py-4 bg-gray-50 rounded-2xl border-1 resize-none"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    ) : (
      <input
        type={type}
        className="w-full pl-10 py-4 bg-gray-50 rounded-2xl border-1"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    )}
  </div>
);

export default FormField;
