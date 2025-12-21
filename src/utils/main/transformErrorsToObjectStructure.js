export const transformErrorsToObjectStructure = (serverErrors) => {
  const errors = {};

  if (typeof serverErrors === "object") {
    Object.keys(serverErrors).forEach((key) => {
      const parts = key.split(".");
      const topLevelKey = parts[0];

      if (parts.length === 1) {
        // Single-level key (e.g., 'name')
        errors[key] = serverErrors[key];
      } else {
        // Nested key (e.g., 'profiledetailtypes.0.mobile')
        const index = parts[1];
        const subKey = parts.slice(2).join(".");

        if (!errors[topLevelKey]) {
          errors[topLevelKey] = [];
        }

        let existingError = errors[topLevelKey].find(
          (item) => item.index === index
        );

        if (!existingError) {
          existingError = { index };
          errors[topLevelKey].push(existingError);
        }

        if (!existingError[subKey]) {
          existingError[subKey] = [];
        }

        if (Array.isArray(serverErrors[key])) {
          existingError[subKey] = [
            ...existingError[subKey],
            ...serverErrors[key],
          ];
        } else {
          existingError[subKey].push(serverErrors[key]);
        }

        // Convert to single string if only one error message exists
        if (existingError[subKey].length === 1) {
          existingError[subKey] = existingError[subKey][0];
        }
      }
    });
  }

  return errors;
};
