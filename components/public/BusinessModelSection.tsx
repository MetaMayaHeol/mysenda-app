import { Sparkles, TrendingUp, BarChart3, Trophy, CreditCard, Megaphone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export async function BusinessModelSection() {
  const t = await getTranslations('businessModel')

  return (
    <div className="py-24 bg-white border-y border-gray-100">
      <div className="container mx-auto px-5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-green-100 text-green-700 font-bold px-4 py-1 rounded-full text-sm mb-6">
            {t('badge')}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Features */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('freeTitle')}</h3>
              <p className="text-gray-600">{t('freeSubtitle')}</p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="text-gray-700" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('professionalProfile')}</h4>
                  <p className="text-sm text-gray-600">{t('professionalProfileDesc')}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="text-gray-700" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('unlimitedPublishing')}</h4>
                  <p className="text-sm text-gray-600">{t('unlimitedPublishingDesc')}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="text-gray-700" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('basicStats')}</h4>
                  <p className="text-sm text-gray-600">{t('basicStatsDesc')}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-700 font-medium">
                ✓ {t('noCommission')}
              </p>
              <p className="text-sm text-gray-700 font-medium">
                ✓ {t('directChat')}
              </p>
              <p className="text-sm text-gray-700 font-medium">
                ✓ {t('priceControl')}
              </p>
            </div>
          </div>

          {/* Premium Features */}
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border-2 border-green-200 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {t('optional')}
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('premiumTitle')}</h3>
              <p className="text-gray-600">{t('premiumSubtitle')}</p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trophy className="text-green-700" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('featuredProfile')}</h4>
                  <p className="text-sm text-gray-600">{t('featuredProfileDesc')}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="text-green-700" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('integratedPayments')}</h4>
                  <p className="text-sm text-gray-600">{t('integratedPaymentsDesc')}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Megaphone className="text-green-700" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('premiumPromotion')}</h4>
                  <p className="text-sm text-gray-600">{t('premiumPromotionDesc')}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-green-200">
              <p className="text-sm text-gray-700 font-medium">
                ✓ {t('payAsYouGo')}
              </p>
              <p className="text-sm text-gray-700 font-medium">
                ✓ {t('noLongContracts')}
              </p>
              <p className="text-sm text-gray-700 font-medium">
                ✓ {t('cancelAnytime')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto">
            <strong>{t('philosophy')}</strong> {t('philosophyText')}
          </p>
        </div>
      </div>
    </div>
  )
}
