import HeroButtons from "./HeroButtons";


export default function HeroContent() {
  return (
    <div>

      <h1 className="text-5xl font-bold leading-tight text-gray-900">

        Find Your Dream Job or

        <br />

        <span className="text-violet-600">
          Perfect Hire
        </span>

      </h1>

      <p className="mt-6 text-lg text-gray-600 max-w-lg leading-8">
        Connect talented professionals with innovative companies.
        Your next career move or perfect candidate is just one click away.
      </p>

      <HeroButtons />

      

    </div>
  );
}