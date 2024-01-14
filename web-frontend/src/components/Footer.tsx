import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <>
      <div className="flex flex-col items-center border-t py-12">
        <Button className="px-0 pt-6 text-xl" variant="link">
          LetMeInUBC
        </Button>
        <p className="pt-1 text-center text-sm text-muted-foreground">
          Copyright © {new Date().getFullYear()} LetMeInUBC
          <br />
          LetMeInUBC is no way affiliated with the University of British
          Columbia.
        </p>
        <p className="pt-4 text-center">
          Built by UBC students, free for everyone. ❤️
        </p>
      </div>
    </>
  );
}
