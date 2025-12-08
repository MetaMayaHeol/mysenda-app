import { ShieldCheck, MessageCircle, Heart } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export async function TestimonialsSection() {
  const tHome = await getTranslations('home')

  const features = [
    {
      icon: ShieldCheck,
      title: tHome('trustVerified'),
      desc: tHome('trustVerifiedDesc'),
      color: 'text-blue-600',
      bgConfig: 'bg-blue-50'
    },
    {
      icon: MessageCircle,
      title: tHome('trustDirect'),
      desc: tHome('trustDirectDesc'),
      color: 'text-green-600',
      bgConfig: 'bg-green-50'
    },
    {
      icon: Heart,
      title: tHome('trustNoFees'),
      desc: tHome('trustNoFeesDesc'),
      color: 'text-pink-600',
      bgConfig: 'bg-pink-50'
    }
  ]

  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex flex-col items-center text-center group">
                  <div className={`w-16 h-16 ${feature.bgConfig} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300`}>
                    <Icon size={32} className={feature.color} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
