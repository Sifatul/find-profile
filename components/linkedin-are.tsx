import { Typography } from "@mui/material"
import React from "react"
import { useState } from "react"
import { PostData } from "../Utils/fetchData"
import LinkedinExperience from './common/linkedin-experience'

const LinkedinArea = (props) => {
  const { linkedin_url } = props

  const [linkedinInfo, setLinkedinInfo] = useState({})
  const getLinkedinUserInfo = React.useCallback(async (linkedinUserName: string) => {

    const linkinedApi = '/api/linkedin'

    const linkedinInfo: any = await PostData(linkinedApi, linkedinUserName)
    setLinkedinInfo(prevState => {
      return {
        ...prevState,
        ...linkedinInfo
      }
    })
  }, [linkedin_url])


  React.useEffect(() => {
    if (!linkedin_url || linkedinInfo?.workExperience) return
    const linkedInUrl = new URL(linkedin_url)
    let { pathname } = linkedInUrl
    if (pathname.substr(-1) === "/") pathname = pathname.slice(0, -1);
    const linkedinUserName = pathname.split("/").pop()

    if (!linkedinUserName) return

    getLinkedinUserInfo(linkedinUserName)


  }, [linkedin_url])


  return <>

    {(linkedinInfo?.workExperience || [])?.length > 0 && <>
      <Typography variant="h5" component="div">
        Experience
    </Typography>

      <Divider sx={{ mb: 5 }} />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>

        {linkedinInfo?.workExperience.map((experience, idx) => <LinkedinExperience experiences={experience} key={'repo' + idx} />)}
      </div>
    </>}
  </>
}
export default LinkedinArea