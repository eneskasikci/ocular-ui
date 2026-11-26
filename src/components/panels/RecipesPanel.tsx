import { memo } from 'react'
import * as m from 'motion/react-m'
import { ToggleGroup } from 'radix-ui'
import { RECIPES, type FilmId } from '../../data/recipes'
import type { CameraController } from '../../hooks/useCameraState'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { SPRING_DETENT } from '../../lib/motion'
import { HEADING_CLS, LEDE_CLS, PANEL_CLS } from './controls'

interface Props {
  headingId: string
  camera: CameraController
}

export const RecipesPanel = memo(function RecipesPanel({ headingId, camera }: Props) {
  const { t, format } = useI18n()
  const { photo, filmId, recipe, selectFilm } = camera

  return (
    <div className="flex flex-col gap-3.5">
      <div className="pool-scrim">
        <h2 id={headingId} className={HEADING_CLS}>
          {t.recipes.heading}
        </h2>
        <p className={LEDE_CLS}>{format(t.recipes.lede, { photo: photo.name })}</p>
      </div>

      <div className={PANEL_CLS}>
        <ToggleGroup.Root
          type="single"
          value={filmId}
          onValueChange={(v) => {
            if (v) selectFilm(v as FilmId)
          }}
          aria-label={t.a11y.filmLooks}
          className="grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-2"
        >
          {RECIPES.map((r) => {
            const selected = r.id === filmId
            return (
              <ToggleGroup.Item
                key={r.id}
                value={r.id}
                className="group relative flex flex-col justify-between gap-1.5 w-full min-h-[68px] px-3 py-2.5 text-left rounded-[14px] bg-graphite/78 border border-hair cursor-pointer transition-[background-color,transform,border-color] duration-180 ease-ocular hover:bg-[#30343d]/92 hover:border-hair-strong active:scale-[0.97]"
              >
                {selected && (
                  <m.span
                    layoutId="recipe-ring"
                    layoutDependency={r.id}
                    className="absolute -inset-px rounded-[14px] border-2 border-amber bg-amber/9 pointer-events-none"
                    transition={SPRING_DETENT}
                    aria-hidden="true"
                  />
                )}
                <div className="flex items-center justify-between gap-1.5">
                  <span className="font-mono font-bold text-[0.78rem] leading-none tracking-[0.08em] text-silver group-data-[state=on]:text-amber">
                    {r.code}
                  </span>
                  <span
                    className={cn(
                      'font-mono font-bold text-[0.72rem] leading-none tracking-[0.08em]',
                      r.tier === 'pro'
                        ? 'text-silver bg-burgundy px-[7px] py-0.5 rounded-full'
                        : 'text-ink-subtle',
                    )}
                  >
                    {r.tier === 'pro' ? t.recipes.proBadge : t.recipes.freeBadge}
                  </span>
                </div>
                <b className="font-display font-bold text-[0.9rem] leading-[1.15] text-silver">{r.name}</b>
                <div className="grid grid-cols-3 h-1 rounded-full overflow-hidden gap-0.5" aria-hidden="true">
                  {r.swatch.map((hex) => (
                    <span key={hex} className="block h-full" style={{ background: hex }} />
                  ))}
                </div>
              </ToggleGroup.Item>
            )
          })}
        </ToggleGroup.Root>

        <div className="mt-3 pt-[11px] border-t border-hair flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <span className="font-body font-semibold text-[0.92rem] leading-[1.3] text-silver">
            {t.recipes.summaries[recipe.id]}
          </span>
          <div className="flex flex-wrap gap-2.5 font-mono font-bold text-[0.74rem] leading-none tracking-[0.06em] text-ink-subtle">
            <span>{recipe.wb}</span>
            <span>{t.recipes.shownCount}</span>
            <span>{t.recipes.customSlots}</span>
          </div>
        </div>
        <p className="mt-2.5 mb-0 pt-2 border-t border-hair/60 font-mono text-[0.72rem] leading-[1.45] tracking-[0.02em] text-ink-subtle">
          {t.recipes.moreStocks}
        </p>
      </div>
    </div>
  )
})
