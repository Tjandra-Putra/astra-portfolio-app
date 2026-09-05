import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="glass pad rise">
      <SignUp
        appearance={{
          variables: { colorPrimary: "#d94d12", borderRadius: "0.75rem", fontFamily: "var(--font-sans)" },
          elements: { card: "shadow-none bg-transparent" },
        }}
      />
    </div>
  );
}
