export default function FeatureCard({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-8">

      <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-violet-100 text-violet-600 mb-6">

        <Icon size={30} />

      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h3>

      <p className="text-gray-600 leading-7">
        {description}
      </p>

    </div>
  );
}