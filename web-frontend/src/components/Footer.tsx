import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <div className="flex flex-col items-center border-t px-4 py-12 md:px-12 lg:px-36 xl:px-[15svw]">
      <Button className="px-0 pt-6 text-xl" variant="link">
        <a href="/">LetMeInUBC</a>
      </Button>
      <p className="pt-1 text-center text-sm text-muted-foreground">
        Copyright © {new Date().getFullYear()} LetMeInUBC
        <br />
        LetMeInUBC is no way affiliated with the University of British Columbia.
      </p>
      <p className="pt-4 text-center">
        Built by UBC students, free for everyone. ❤️
      </p>
    </div>
  );
}
