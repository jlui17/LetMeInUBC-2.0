export default function InfoStepper() {
  return (
    <div className="mt-8 flex w-full flex-col gap-4 md:flex-row md:items-center">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary text-primary-foreground">
          1
        </div>
        <p className="font-semibold">Register</p>
      </div>
      <div className="ml-[23px] h-[64px] flex-grow border-l-2 border-primary md:ml-0 md:h-0 md:border-t-2" />
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary text-primary-foreground">
          2
        </div>
        <p className="font-semibold">Track a course</p>
      </div>
      <div className="ml-[23px] h-[64px] flex-grow border-l-2 border-primary md:ml-0 md:h-0 md:border-t-2" />
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary text-primary-foreground">
          3
        </div>
        <p className="font-semibold">Get notified</p>
      </div>
    </div>
  );
}
