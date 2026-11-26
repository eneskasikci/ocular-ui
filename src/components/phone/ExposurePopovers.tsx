import * as m from 'motion/react-m'
import { Slider } from 'radix-ui'
import { formatEv } from '../../data/recipes'
import { OCULAR_HUD_SPEC } from '../../generated/ocularSpec'
import type { ActiveExposureControl, CameraController } from '../../hooks/useCameraState'
import { cn } from '../../lib/cn'
import { EASE_OUT } from '../../lib/motion'

const EV_STOPS = Array.from({ length: 19 }, (_, idx) => {
  const val = Math.round((-3 + idx / 3) * 10) / 10
  return { val, label: formatEv(val) }
})

function StopLadder({
  stops,
  currentLabel,
  resetLabel,
  isDefault,
  onReset,
  onSelect,
}: {
  stops: readonly string[]
  currentLabel: string
  resetLabel: string
  isDefault: boolean
  onReset: () => void
  onSelect: (val: string) => void
}) {
  return (
    <div className="w-full rounded-[12px] bg-obsidian/92 backdrop-blur-md border border-silver/20 p-1 flex flex-col gap-1 shadow-[0_10px_24px_rgba(0,0,0,.55)]">
      <button
        type="button"
        onClick={onReset}
        className={cn(
          'w-full h-6 rounded-[7px] bg-obsidian/85 font-mono font-extrabold text-[8px] leading-none cursor-pointer border',
          isDefault ? 'border-amber/85 bg-amber/18 text-amber' : 'border-silver/18 text-silver/85',
        )}
      >
        {resetLabel}
      </button>

      <div className="max-h-[108px] overflow-y-auto flex flex-col gap-0.5 pr-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {stops.map((stop) => {
          const active = stop === currentLabel
          return (
            <button
              key={stop}
              type="button"
              onClick={() => onSelect(stop)}
              className={cn(
                'w-full h-[21px] shrink-0 px-1 rounded-[6px] flex items-center justify-between font-mono leading-none cursor-pointer border transition-colors',
                active
                  ? 'bg-amber/16 border-amber/65 text-amber font-black text-[9px]'
                  : 'bg-transparent border-transparent text-silver/74 font-bold text-[8px] hover:bg-silver/8',
              )}
            >
              <span className={cn('w-1 h-px', active ? 'bg-amber w-1.5' : 'bg-silver/30')} />
              <span>{stop}</span>
              <span className={cn('w-1 h-px', active ? 'bg-amber w-1.5' : 'bg-silver/30')} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

function InlineWhiteBalanceConsole({
  camera,
  onClose,
}: {
  camera: CameraController
  onClose: () => void
}) {
  const { phoneRecipe, wbMode, wbKelvin, wbRed, wbBlue, setWbMode, setWbKelvin, setWbShift, resetWhiteBalance } =
    camera
  const isLocked = !phoneRecipe.canModify
  const isCustomized = wbMode !== 'auto' || wbRed !== 0 || wbBlue !== 0
  const modeLabel = OCULAR_HUD_SPEC.wbModes.find((m) => m.id === wbMode)?.label ?? 'Auto'
  const summary =
    wbMode === 'kelvin'
      ? `${wbKelvin}K R${wbRed >= 0 ? `+${wbRed}` : wbRed} B${wbBlue >= 0 ? `+${wbBlue}` : wbBlue}`
      : `${modeLabel} R${wbRed >= 0 ? `+${wbRed}` : wbRed} B${wbBlue >= 0 ? `+${wbBlue}` : wbBlue}`

  return (
    <div className="w-full p-2.5 rounded-[16px] bg-obsidian/94 backdrop-blur-md border border-silver/22 shadow-[0_14px_32px_rgba(0,0,0,.6)] flex flex-col gap-2 text-silver">
      <div className="flex items-center justify-between gap-1.5">
        <div className="min-w-0 flex items-center gap-1 font-mono text-[7.5px] leading-none">
          <span className="font-bold tracking-[0.06em] uppercase text-amber shrink-0">WB</span>
          <span className="text-silver/35">•</span>
          <span className="font-extrabold text-silver truncate">{summary}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {isLocked ? (
            <span className="px-1.5 py-0.5 rounded-full bg-amber/16 border border-amber/55 font-mono font-extrabold text-[7px] text-amber uppercase">
              READ-ONLY
            </span>
          ) : (
            isCustomized && (
              <button
                type="button"
                onClick={resetWhiteBalance}
                className="px-1.5 py-0.5 rounded-full bg-amber/18 border border-amber/75 font-mono font-extrabold text-[7px] text-amber uppercase cursor-pointer"
              >
                RESET
              </button>
            )
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close white balance console"
            className="w-5 h-5 rounded-full bg-obsidian/80 border border-silver/20 text-silver text-[12px] leading-none flex items-center justify-center p-0 cursor-pointer"
          >
            ×
          </button>
        </div>
      </div>

      {/* Mode strip */}
      <div className="flex gap-1 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {OCULAR_HUD_SPEC.wbModes.map((mItem) => {
          const active = mItem.id === wbMode
          return (
            <button
              key={mItem.id}
              type="button"
              disabled={isLocked}
              onClick={() => setWbMode(mItem.id)}
              className={cn(
                'px-2 h-6 rounded-full shrink-0 border font-mono font-bold text-[7.5px] leading-none cursor-pointer disabled:opacity-55',
                active
                  ? 'bg-amber/20 border-amber text-amber'
                  : 'bg-graphite/80 border-silver/16 text-silver/80',
              )}
            >
              {mItem.label}
            </button>
          )
        })}
      </div>

      {/* Split deck: Kelvin slider + 2D R/B coordinate pad */}
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-center justify-between font-mono text-[7.5px] text-silver/72">
            <span>KELVIN</span>
            <b className="text-amber font-extrabold">{wbKelvin}K</b>
          </div>
          <Slider.Root
            min={2500}
            max={10000}
            step={100}
            disabled={isLocked}
            value={[wbKelvin]}
            onValueChange={([v]) => setWbKelvin(v)}
            className="relative flex items-center w-full h-5 cursor-pointer touch-none select-none"
          >
            <Slider.Track
              className="relative h-2 w-full rounded-full border border-silver/20"
              style={{
                background: 'linear-gradient(90deg, #5da9ff 0%, #f3f1ec 50%, #ff9b42 100%)',
              }}
            >
              <Slider.Range className="hidden" />
            </Slider.Track>
            <Slider.Thumb
              aria-label="Kelvin color temperature"
              className="block w-3.5 h-3.5 rounded-full bg-amber border-2 border-obsidian shadow"
            />
          </Slider.Root>
          <div className="flex items-center justify-between gap-1 font-mono text-[7.5px] text-silver/75">
            <span>R {wbRed >= 0 ? `+${wbRed}` : wbRed}</span>
            <span>B {wbBlue >= 0 ? `+${wbBlue}` : wbBlue}</span>
          </div>
        </div>

        {/* 2D R/B Coordinate Shift Pad */}
        <button
          type="button"
          disabled={isLocked}
          aria-label={`White balance shift pad, R ${wbRed}, B ${wbBlue}`}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const nx = (e.clientX - rect.left) / rect.width
            const ny = (e.clientY - rect.top) / rect.height
            const nextR = Math.round((nx - 0.5) * 18)
            const nextB = Math.round((0.5 - ny) * 18)
            setWbShift(nextR, nextB)
          }}
          className="relative w-[72px] h-[72px] shrink-0 rounded-[10px] border border-silver/22 overflow-hidden cursor-crosshair disabled:opacity-55"
          style={{
            background:
              'radial-gradient(circle at 80% 50%, rgba(232,131,42,.24), transparent 55%), radial-gradient(circle at 20% 50%, rgba(56,160,180,.2), transparent 55%), radial-gradient(circle at 50% 18%, rgba(80,140,240,.22), transparent 55%), #0c0d10',
          }}
        >
          <span className="absolute inset-x-0 top-1/2 h-px bg-silver/18 pointer-events-none" aria-hidden="true" />
          <span className="absolute inset-y-0 left-1/2 w-px bg-silver/18 pointer-events-none" aria-hidden="true" />
          <span
            className="absolute w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full bg-amber border border-obsidian shadow pointer-events-none"
            style={{
              left: `${((wbRed + 9) / 18) * 100}%`,
              top: `${((9 - wbBlue) / 18) * 100}%`,
            }}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  )
}

/** Column-aligned vertical stop sliders (SS / ISO / EV) + inline WB console matching iOS `ExposureTriangleCapsuleView`. */
export function ExposurePopovers({
  camera,
  activeControl,
  onClose,
}: {
  camera: CameraController
  activeControl: ActiveExposureControl
  onClose: () => void
}) {
  const { shutterSpeed, iso, ev, setShutterSpeed, setIso, setEv } = camera

  if (activeControl === 'whiteBalance') {
    return (
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.16, ease: EASE_OUT }}
      >
        <InlineWhiteBalanceConsole camera={camera} onClose={onClose} />
      </m.div>
    )
  }

  const evLabel = formatEv(ev)

  return (
    <m.div
      className="grid grid-cols-4 gap-[3px] px-1 items-end"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.16, ease: EASE_OUT }}
    >
      {activeControl === 'shutterSpeed' ? (
        <StopLadder
          stops={OCULAR_HUD_SPEC.shutterStops}
          currentLabel={shutterSpeed}
          resetLabel="AUTO"
          isDefault={shutterSpeed === 'AUTO'}
          onReset={() => setShutterSpeed('AUTO')}
          onSelect={setShutterSpeed}
        />
      ) : (
        <div className="h-[132px]" onClick={onClose} aria-hidden="true" />
      )}

      {activeControl === 'iso' ? (
        <StopLadder
          stops={OCULAR_HUD_SPEC.isoStops}
          currentLabel={iso}
          resetLabel="AUTO"
          isDefault={iso === 'AUTO'}
          onReset={() => setIso('AUTO')}
          onSelect={setIso}
        />
      ) : (
        <div className="h-[132px]" onClick={onClose} aria-hidden="true" />
      )}

      {activeControl === 'ev' ? (
        <StopLadder
          stops={EV_STOPS.map((e) => e.label)}
          currentLabel={evLabel}
          resetLabel="0.0"
          isDefault={Math.abs(ev) < 0.05}
          onReset={() => setEv(0)}
          onSelect={(lbl) => {
            const found = EV_STOPS.find((e) => e.label === lbl)
            if (found) setEv(found.val)
          }}
        />
      ) : (
        <div className="h-[132px]" onClick={onClose} aria-hidden="true" />
      )}

      <div className="h-[132px]" onClick={onClose} aria-hidden="true" />
    </m.div>
  )
}
