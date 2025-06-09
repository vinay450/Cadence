
const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      title: "Upload Your Data",
      description: "Simply drag and drop your dataset or connect to your data source. We support all major formats.",
      gradientColors: "from-blue-500 to-purple-600"
    },
    {
      number: "2",
      title: "Ask Questions",
      description: "Chat with your data using natural language. Ask anything - from simple queries to complex analysis.",
      gradientColors: "from-purple-500 to-teal-600"
    },
    {
      number: "3",
      title: "Get Insights",
      description: "Receive instant visualizations, analytics, and insights that help you make data-driven decisions.",
      gradientColors: "from-teal-500 to-green-600"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Cadence Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to transform your data into actionable insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-br ${step.gradientColors} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <span className="text-white font-bold text-xl">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
