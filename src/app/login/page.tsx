import { login, signup } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const message = (await searchParams).message
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-20 mx-auto">
      <div className="glass-panel p-8 rounded-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">AI Orchestrator</h1>
        
        <form className="animate-in flex-1 flex flex-col w-full justify-center gap-4 text-gray-200">
          <label className="text-sm font-medium" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            className="rounded-xl px-4 py-3 bg-white/5 border border-white/10 mb-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            name="email"
            placeholder="tu@negocio.com"
            required
          />
          <label className="text-sm font-medium" htmlFor="password">
            Contraseña
          </label>
          <input
            className="rounded-xl px-4 py-3 bg-white/5 border border-white/10 mb-6 text-white focus:outline-none focus:border-blue-500 transition-colors"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          
          <button
            formAction={login}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 py-3 font-medium transition-colors mb-2"
          >
            Iniciar Sesión
          </button>
          
          <button
            formAction={signup}
            className="border border-white/20 hover:bg-white/5 text-white rounded-xl px-4 py-3 font-medium transition-colors"
          >
            Registrar mi Negocio
          </button>
          
          {message && (
            <p className="mt-4 p-4 bg-red-500/10 border border-red-500/50 text-red-400 text-center text-sm rounded-xl">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
