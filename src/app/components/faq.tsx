import React, { useState } from 'react';

interface QA {
  question: string;
  answer: string;
}

const qa: QA[] = [
  {
    question: "What is Glow?",
    answer: "Glow is a crypto-economic protocol accelerating the transition to clean energy, with a focus on solar. Glow rewards solar farms with cash and tokens for producing electricity, making solar economically viable in more regions. The goal is to create abundant and affordable clean power to outcompete carbon-intensive energy sources."
  },
  {
    question: "How does Glow work?",
    answer: "Solar farms join Glow by contributing the present value of 10 years of their electricity revenue upfront. Glow Certification Agents audit the farms and certify carbon credits. These credits are tokenized and sold in auctions. Glow distributes its native token (GLW) and USDC rewards to solar farms based on their contributions and carbon credit production."
  },
  {
    question: "What is a carbon credit?",
    answer: "A carbon credit is a tradable certificate that represents one metric tonne of CO2 (or an equivalent amount in other greenhouse gases) captured or prevented from entering the atmosphere. It is used to incentivize the reduction of global CO2 emissions."
  },
  {
    question: "Where does the demand for carbon credits come from?",
    answer: "Carbon credits are purchased by various entities to offset emissions and meet climate targets. Buyers include corporations with net-zero or strict commitments, governments complying with international agreements, and environmentally conscious individuals offsetting personal carbon footprints."
  },
  {
    question: "What makes Glow Carbon Credits different?",
    answer: "Glow Carbon Credits (GCC) are designed to ensure high additionality, meaning they represent emissions reductions that wouldn't have occurred without the incentive. They're also more reliable due to Glow's strict requirements and robust auditing system."
  },
  {
    question: "What is the Glow token used for?",
    answer: "The Glow token (GLW) is used as a reward for protocol participants and is the required currency to acquire Glow Carbon Credits (GCC). It's distributed on a fixed inflationary schedule and is burned when used to purchase GCC."
  },
  {
    question: "Why invest in solar?",
    answer: "Solar energy is currently the world's cheapest source of clean electricity. The cost of producing solar energy has decreased by 95% since 2001, making it a cost-effective way to decrease electricity-related CO2 emissions."
  },
  {
    question: "How can I participate in Glow?",
    answer: "The primary way to participate in Glow is by deploying a solar farm specifically for the protocol. Anyone who deploys a solar farm can join Glow and compete for rewards. Visit glow.org for more information on the steps to follow to join the protocol."
  }
]

// <a href='https://glow.org/' target='_blank'>glow.org</a>

const FAQ: React.FC = () => {
  const [openQuestions, setOpenQuestions] = useState<Set<number>>(new Set());

  const toggleQuestion = (index: number) => {
    setOpenQuestions(prevOpenQuestions => {
      const newOpenQuestions = new Set(prevOpenQuestions);
      if (newOpenQuestions.has(index)) {
        newOpenQuestions.delete(index);
      } else {
        newOpenQuestions.add(index);
      }
      return newOpenQuestions;
    });
  };

  return (
    <div className="p-6 pl-0 flex items-start gap-12">
      <div className='max-w-[900px]'>
        {qa.map((item, index) => (
          <div key={index} className="border-b border-gray-700 py-4">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleQuestion(index)}
            >
              <h3 className="lg:text-2xl text-xl font-lg">{item.question}</h3>
              <button className="text-2xl focus:outline-none">
                {openQuestions.has(index) ? '−' : '+'}
              </button>
            </div>
            <div 
              className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${
                openQuestions.has(index) ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <p className="lg:text-xl text-lg leading-relaxed opacity-80">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;