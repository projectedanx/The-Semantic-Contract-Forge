import React, { useCallback } from 'react';
import { GeometricConstraints } from '../types';

/**
 * @file components/GeometricEditor.tsx
 * @description Provides a UI for defining non-Euclidean geometric constraints.
 * Part of Project Aurelius (Phase 1).
 */

export interface GeometricEditorProps {
  /** The current geometric constraints object. */
  constraints: GeometricConstraints | undefined;
  /** Callback fired when the constraints change. */
  onChange: (constraints: GeometricConstraints | undefined) => void;
  /** Whether the editor is disabled (e.g., tier locking). */
  disabled?: boolean;
}

const DEFAULT_CONSTRAINTS: GeometricConstraints = {
  topologyType: 'Euclidean',
  curvature: 0,
  coordinateSystem: 'Cartesian',
  dimensions: 3,
};

/**
 * Reusable input wrapper component for the Geometric Editor.
 */
const InputField: React.FC<{
  label: string;
  name: keyof GeometricConstraints;
  value: string | number;
  type?: string;
  min?: string;
  max?: string;
  step?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  disabled?: boolean;
  options?: string[];
}> = ({ label, name, value, type = 'text', min, max, step, onChange, disabled, options }) => {
  return (
    <div className="flex flex-col mb-4 w-full">
      <label className="text-sm font-medium text-slate-300 mb-1">{label}</label>
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="p-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition text-slate-100 disabled:opacity-50"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <div className="flex items-center gap-4">
          {type === 'range' && <span className="text-slate-400 text-sm min-w-[2rem] text-right">{value}</span>}
          <input
            type={type}
            name={name}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
            disabled={disabled}
            className={`p-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition text-slate-100 disabled:opacity-50 ${type === 'range' ? 'flex-grow' : 'w-full'}`}
          />
        </div>
      )}
    </div>
  );
};

export const GeometricEditor: React.FC<GeometricEditorProps> = ({ constraints, onChange, disabled }) => {
  const isEnabled = constraints !== undefined;

  const currentConstraints = constraints || DEFAULT_CONSTRAINTS;

  const handleToggle = useCallback(() => {
    if (isEnabled) {
      onChange(undefined);
    } else {
      onChange({ ...DEFAULT_CONSTRAINTS });
    }
  }, [isEnabled, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    let parsedValue: string | number = value;
    if (type === 'number' || type === 'range') {
      parsedValue = parseFloat(value) || 0;
    }

    onChange({
      ...currentConstraints,
      [name]: parsedValue,
    });
  }, [currentConstraints, onChange]);

  return (
    <div className={`p-4 border border-indigo-500/30 rounded-lg bg-indigo-900/10 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-indigo-300">Geometric Matrix Constraints</h3>
          <p className="text-xs text-slate-400">Project Aurelius Non-Euclidean API</p>
        </div>
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={isEnabled}
              onChange={handleToggle}
              disabled={disabled}
            />
            <div className={`block w-10 h-6 rounded-full transition ${isEnabled ? 'bg-indigo-500' : 'bg-slate-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${isEnabled ? 'translate-x-4' : ''}`}></div>
          </div>
          <span className="ml-3 text-sm font-medium text-slate-300">{isEnabled ? 'Active' : 'Inactive'}</span>
        </label>
      </div>

      {isEnabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-slate-800/50 rounded-md border border-slate-700">
          <InputField
            label="Topology Type"
            name="topologyType"
            value={currentConstraints.topologyType}
            onChange={handleChange}
            options={['Euclidean', 'Hyperbolic', 'Spherical', 'Riemannian', 'Torus']}
            disabled={disabled}
          />
          <InputField
            label="Coordinate System"
            name="coordinateSystem"
            value={currentConstraints.coordinateSystem}
            onChange={handleChange}
            options={['Cartesian', 'Polar', 'Poincare Disk', 'Stereographic']}
            disabled={disabled}
          />
          <InputField
            label="Dimensions"
            name="dimensions"
            type="number"
            min="2"
            max="11"
            value={currentConstraints.dimensions}
            onChange={handleChange}
            disabled={disabled}
          />
          <InputField
            label="Gaussian Curvature (κ)"
            name="curvature"
            type="range"
            min="-5"
            max="5"
            step="0.1"
            value={currentConstraints.curvature}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
};

export default GeometricEditor;
