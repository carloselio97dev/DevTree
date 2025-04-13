import { Navigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import { getUserByHandle } from "../api/DevTreeAPI";
import { HandleData } from "../Components/HandleData";

export const HandelView = () => {
  const params = useParams();
  const handle = params.handle!
  const { data, error, isLoading } = useQuery({
    queryFn: () => getUserByHandle(handle),
    queryKey: ['handle', handle],
    retry: 1
  })
  console.log(isLoading);
  console.log(error);
  console.log(data);
  if (isLoading) return <p className="text-center text-white">'Cargando...'</p>
  if (error) return <Navigate to={'/404'} />

  if (data) return <HandleData data={data}/>
}
