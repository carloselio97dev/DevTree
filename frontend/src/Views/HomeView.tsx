import { Header } from "../Components/Header"
import { SearchForm } from "../Components/SearchForm"

export const HomeView = () => {
  return (
    <>
      <Header/>
      <main className="bg-gray-100 py-10 min-h-screen bg-no-repeat bg-right-top lg:bg-home lg:bg-home-xl">
          <div className="max-w-5xl mx-auto mt-10">
              <div className="lg:w-1/2 px-10 lg:p-0 space-y-6">
                <h1 className="text-6xl font-black">
                    Todas tus <span className="text-cyan-400"> Redes Sociales</span> en tu enlace
                </h1>
                <p className="text-slate-800 text-xl">Únete a mas de 200 mil developers compartiendo sus redes Sociales, comparte tu perfil de Tik Tok, Facebook, Instagram , Youtube, Github y mas</p>
                <SearchForm/>
              </div>
          </div>
      </main>
    </>
  )
}
