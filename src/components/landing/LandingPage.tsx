import React, { useState, useCallback } from 'react';
import { FileText, Sparkles, Crown, Check, Menu, X } from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';

export function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Memoize features to prevent re-renders
  const features = React.useMemo(() => [
    {
      icon: FileText,
      title: 'Rich Text Editor',
      description: 'Create beautifully formatted notes with our advanced editor'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Summaries',
      description: 'Get instant 3-bullet summaries of your notes using AI'
    },
    {
      icon: Crown,
      title: 'Premium Features',
      description: 'Unlimited notes and AI features for just $5/month'
    }
  ], []);

  // Memoize pricing plans
  const pricingPlans = React.useMemo(() => [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        '10 notes per month',
        'Basic rich text editor',
        'Search and tags',
        'Mobile responsive'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Premium',
      price: '$5',
      period: 'per month',
      features: [
        'Unlimited notes',
        'AI summaries & insights',
        'Advanced formatting',
        'Priority support',
        'Flashcard generation'
      ],
      cta: 'Start Free Trial',
      popular: true
    }
  ], []);

  // Use useCallback for event handlers
  const openAuth = useCallback((tab: 'signin' | 'signup') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">QuickNote AI</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => openAuth('signin')}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Sign in"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuth('signup')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Get started"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4" aria-label="Mobile menu">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    openAuth('signin');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Sign in"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openAuth('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Get started"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart Note-Taking
            <span className="text-blue-600"> Powered by AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Capture your thoughts, organize with tags, and get AI-powered summaries. 
            The smartest way to manage your notes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => openAuth('signup')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Start free today"
            >
              Start Free Today
            </button>
            <button
              onClick={() => openAuth('signin')}
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Sign in"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for better note-taking
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to help you capture, organize, and understand your thoughts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4" aria-labelledby="pricing-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="pricing-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose your plan
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-8 border-2 ${
                  plan.popular ? 'border-blue-500' : 'border-gray-200'
                } relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" aria-hidden="true" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => openAuth('signup')}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                  aria-label={`Choose ${plan.name} plan`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto text-center">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to transform your note-taking?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who've already upgraded their productivity
          </p>
          <button
            onClick={() => openAuth('signup')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Get started free"
          >
            Get Started Free
          </button>
        </div>
      </section>

      <AuthModal
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        initialTab={authTab}
      />
    </div>
  );
}