import RenderCardStats from './renderCardStats'

type StatsData = {
  creadas: number
  enProgreso: number
  proximasAVencer: number
  vencidas: number
  completadas: number
  canceladas: number
}

interface Props {
  title: string
  statsData: StatsData
  navigatePath: string
}

export default function RenderStatsSection({ title, statsData, navigatePath }: Props) {
  return (
    <div className='mb-8 border-e-2 p-2'>
      <h2 className='mb-4 text-2xl font-semibold'>{title}</h2>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2'>
        {/* Creadas */}
        <RenderCardStats state='creadas' statsCount={statsData.creadas} url={navigatePath} />

        {/* En Progreso */}
        <RenderCardStats state='enProgreso' statsCount={statsData.enProgreso} url={navigatePath} />

        {/* Próximas a Vencerse */}
        <RenderCardStats
          state='proximasAVencer'
          statsCount={statsData.proximasAVencer}
          url={navigatePath}
        />

        {/* Vencidas */}
        <RenderCardStats state='vencidas' statsCount={statsData.vencidas} url={navigatePath} />

        {/* Completadas */}
        <RenderCardStats
          state='completadas'
          statsCount={statsData.completadas}
          url={navigatePath}
        />

        {/* Canceladas */}
        <RenderCardStats state='canceladas' statsCount={statsData.canceladas} url={navigatePath} />
      </div>
    </div>
  )
}
