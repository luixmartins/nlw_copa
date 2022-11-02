import Image from "next/image"
import appPreviewImage from "../assets/app-nlw-copa-preview.png"
import logoImage from "../assets/logo.svg"
import usersAvatar from '../assets/avatares.png'
import checkIcon from "../assets/check.svg"
import { api } from "../lib/axios"
import { FormEvent, useState } from "react"

interface HomeProps {
    poolCount: number;
    guessCount: number;
    userCount: number;
}

export default function Home(props: HomeProps) {
    const [poolTitle, setPoolTitle] = useState('')

    async function createPool(event: FormEvent) {
        event.preventDefault()

        try{
            const response = await api.post('/pools', {
                title: poolTitle, 
            })

            const { code } = response.data 

            await navigator.clipboard.writeText(code)

            alert('Bolão criado com sucesso, o código foi copiado para a área de transferência!')

            setPoolTitle('')
        } catch (err){
            alert('Falha ao criar o bolão, tente novamente!')
        }
    }
    return (
        <div className="max-w-6xl h-screen mx-auto grid grid-cols-2 items-center gap-28">
            <main>
                <Image 
                    src={logoImage}
                    alt={"NLW Copa"}
                    quality={100}
                />

                <h1 className=" text-white-700 mt-14  text-5xl font-bold ">
                    Crie seu próprio bolão da copa e compartilhe entre amigos!
                </h1>

                <div className="mt-10 flex items-center gap-2 ">
                    <Image src={usersAvatar} alt={""} quality={100}/>
                    <strong className="text-gray-100 text-xl">
                        <span className="text-ignite-500">+{props.userCount}</span> pessoas já estão usando 
                    </strong>
                </div>

                <form onSubmit={createPool} className="mt-10 flex gap-2">
                    <input 
                        className="flex-1 px-6 py-4 rounded bg-gray-800 border-gray-600 text-sm text-gray-100"
                        type="text" 
                        required 
                        placeholder="Qual o nome do seu bolão?" 
                        onChange={event => setPoolTitle(event.target.value)}
                        value={poolTitle}
                    />
                    <button 
                        className="bg-yellow-500 px-6 py-4 text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
                        type="submit">
                            Criar meu bolão
                    </button>
                </form>

                <p className="mt-4 text-sm text-gray-300" leading-relaxed>
                    Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas. 
                </p>
                <div className="mt-10 pt-10 border-t border-gray-600  flex items-center justify-between text-gray-100">
                    <div className="flex items-center gap-6">
                        <Image src={checkIcon} alt={""} quality={100}/>
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl">+{props.poolCount}</span>
                            <span>Bolões criados</span>
                        </div>
                    </div>
                    
                    <div className="w-px h-14 bg-gray-600"></div>

                    <div className="flex items-center gap-6">
                        <Image src={checkIcon} alt={""} quality={100}/>
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl">+{props.guessCount}</span>
                            <span>Palpites enviados</span>
                        </div>
                    </div>
                </div>
            </main>

            <Image 
                src={appPreviewImage} 
                alt={"Celulares"} 
                //width={600}
                quality={100}
            />
        </div>
    )
}

export const getServerSideProps = async () => {
    const [poolCountResponse, 
            guessCountResponse, 
            usersCountResponse] = await Promise.all([
        api.get('pools/count'),
        api.get('guesses/count'),
        api.get('users/count'),
    ])

    return {
        props: {
            poolCount: poolCountResponse.data.count, 
            guessCount: guessCountResponse.data.count, 
            usersCount: usersCountResponse.data.count,
        }
    }
}