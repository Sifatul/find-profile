import { getDomain, isEmail } from 'js-string-helper';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { UseAppDispatch } from '../store';
import { resetSearchType, setSearchTypeEmail, setSearchTypeName, setSearchTypeUrl, userInfoType } from '../store/search';
import { setEmail, setUserInfo } from '../store/user/basicInfo';
import { Filter } from '../types/common.types';
import { GetData } from '../Utils/fetchData';

export default function SearchHelper(searchVal: string) {
  const dispatch = UseAppDispatch();
  const router = useRouter()


  const getUserByPlatform = useCallback(async () => {
    const hostnameAndQueryKey = {
      GITHUB: "github_url",
      LEETCODE: "leetcode_url",
      HACKERRANK: "hackerrank_url",
      CODEPEN: "codepen_url",
      MEDIUM: "medium_url",
      LINKEDIN: "linkedin_url"
    }
    if (!searchVal) return
    const _platformName = getDomain(searchVal)
    if (!_platformName) return
    const platformName = _platformName.split('.')?.[0]

    const queryKey = hostnameAndQueryKey[platformName.toUpperCase() as Filter]
    if (!queryKey) return
    const param = {
      [queryKey]: searchVal
    }

    return await GetData(`/api/users/find?param=${JSON.stringify(param)}`)


  }, [searchVal])
  const updateStoreWithUserInfo = useCallback((userInfo: userInfoType) => {
    dispatch(setSearchTypeEmail({ userFound: userInfo, originalSearchVal: userInfo.email }))
    dispatch(setEmail(userInfo.email))
  }, [])

  const searchInputHandler = useCallback(async () => {

    if (!searchVal) return;

    dispatch(resetSearchType)

    if (isEmail(searchVal)) {

      const userInfo: any = await GetData(`/api/users/find?param=${JSON.stringify({ email: searchVal })}`)

      if (userInfo.status == 200) {
        dispatch(setUserInfo(userInfo))
        router.push(`/${userInfo?.userName}`)
        return
      }
    }


    try {
      // check if it is a valid url

      let { protocol, hostname, pathname } = new URL(searchVal);

      // check values exists in database
      const userInfo: any = await getUserByPlatform()
      if (userInfo && userInfo?.status == 200) {
        dispatch(setUserInfo(userInfo))
        router.push(`/${userInfo?.userName}`)
        return
      }

      //remove trailing slash
      if (pathname.substr(-1) === '/') pathname = pathname.slice(0, -1);

      //its a valid url
      dispatch(setSearchTypeUrl({
        protocol,
        hostname,
        pathname,
        originalSearchVal: searchVal,
      }))
    } catch (e) {
      console.error(e);
      dispatch(setSearchTypeName(searchVal))

    }

  }, [searchVal])
  return { searchInputHandler }

}