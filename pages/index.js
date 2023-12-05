import Image from 'next/image'
import { Inter } from 'next/font/google'
import AudioStreaming from '@/components/AudioStreaming'
import AudioStreaming1 from '@/components/AudioStreaming1'
import Audio3 from '@/components/Audio3'
import DebouncedSearchExample from '@/components/DebouncedSearchExample'
import Socket from '@/components/Socket'
import Refresh from '@/components/Refresh'
import UseTitleCount from '@/customhooks/useTitleCount'
import NewTry from '@/components/NewTry'
import AudioStreamingWithSpeechRecognition from '@/components/AudioStreamingWithSpeechRecognition'



const inter = Inter({ subsets: ['latin'] })
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react'
import NewWav from '@/components/AudioRecorder10'
import AudioRecorder from '@/components/AudioRecorder'
import AudioRecorder10 from '@/components/AudioRecorder10'

export default function Home() {
  // const [count, setCount] = useState(0);
  const [id, setId] = useState('')

  let endObj = { "event": "stop", "uuid": id }
  //  let mainData =   {"event": "media",
  // "media": {
  // "chunk": chunk_seq,
  // "payload": chunk(gzipped),
  // "uuid":"1234"
  // }}
  // console.log(startObj, '--data-')
  // console.log(JSON.stringify(startObj), '--dts--hj')
  // console.log(endObj, '--end obj--')
  // useEffect(() => {
  //   setId(uuidv4())
  // }, [])

  // useEffect(() => {
  //   if (id != "") {
  //     let startObj = {
  //       "event": "start",
  //       "start": {
  //         "user_id": "",
  //         "uuid": id
  //       }
  //     }
  //     console.log(startObj, '-st')
  //   }
  // }, [id])
  // UseTitleCount()
  return (
    <div>
      {/* <Audio3 /> */}
      {/* <AudioStreaming /> */}


      {/* <AudioStreaming1 /> */}
      {/* <AudioStreamingWithSpeechRecognition /> */}

      <NewTry />

      {/* <AudioRecorder /> */}


      {/* <AudioRecorder10 /> */}


      {/* <NewWav /> */}


      {/* <DebouncedSearchExample />/ */}
      {/* <Socket /> */}
      {/* <Refresh /> */}
      {/* <button onClick={() => { console.log(JSON.stringify(endObj)) }} className='bg-blue-500 p-4 w-[200px] rounded-md m-5 hover:bg-blue-500/80'>Stop</button> */}

    </div>
  )
}
