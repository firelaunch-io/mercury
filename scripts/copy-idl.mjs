import "zx/globals";

const targetPath = path.join(
  process.cwd(),
  "apps/frontend/src/core/firelaunch"
);

await spinner(
  () => $`cp ../firelaunch/program/idl.json ${targetPath}/idl.json`
);
await spinner(
  () =>
    $`cp ../firelaunch/target/types/firelaunch_io_firelaunch.ts ${targetPath}/idl.ts`
);
