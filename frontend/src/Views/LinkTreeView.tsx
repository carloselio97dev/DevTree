import { useEffect, useState } from "react"
import { social } from "../data/social"
import { DevTreeInput } from "../Components/DevTreeInput";
import { isValidUrl } from "../utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { udpateProfile } from "../api/DevTreeAPI";
import { SocialNetwork, User } from "../Types";


export const LinkTreeView = () => {

  const [devTreeLinks, setDevTreeLinks] = useState(social);
  const queryClient = useQueryClient();
  //Almacena el Usuario
  const user: User = queryClient.getQueryData(['user'])!;

  const { mutate } = useMutation({
    mutationFn: udpateProfile,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Actualizado Correctamente");
    }
  })

  useEffect(() => {

    const updatedData = devTreeLinks.map(item => {
      const userLink = JSON.parse(user.links).find((link: SocialNetwork) => link.name === item.name)
      if (userLink) {
        return { ...item, url: userLink.url, enabled: userLink.enabled }
      }
      else {
        return item;
      }
    })
    setDevTreeLinks(updatedData);

  }, [])


  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = devTreeLinks.map(link => link.name == e.target.name ? { ...link, url: e.target.value } : link)
    setDevTreeLinks(updatedLinks);

  }

  const links: SocialNetwork[] = JSON.parse(user.links)

  const handleEnabledLink = (socialNetwork: string) => {
    const updatedLinks = devTreeLinks.map(link => {
      if (link.name == socialNetwork) {
        if (isValidUrl(link.url)) {
          return { ...link, enabled: !link.enabled }
        }
        else {
          toast.error("Url no Valida");
          return link;
        }
      }
      return link;
    });
    
    setDevTreeLinks(updatedLinks);
    
    const selectSocialNetwork = updatedLinks.find(link => link.name === socialNetwork);
    let updatedItems: SocialNetwork[] = [...links];
  
    if (selectSocialNetwork?.enabled) {
      // Buscar si ya existe el link (aunque esté deshabilitado)
      const existingLinkIndex = updatedItems.findIndex(link => link.name === socialNetwork);
      
      if (existingLinkIndex >= 0) {
        // Si existe, mantener su ID original y solo cambiar enabled a true
        updatedItems[existingLinkIndex] = {
          ...updatedItems[existingLinkIndex],
          enabled: true
        };
      } else {
        // Si no existe, crear nuevo con ID único
        const maxId = updatedItems.reduce((max, link) => Math.max(max, link.id || 0), 0);
        const newItem = {
          ...selectSocialNetwork,
          id: maxId + 1,
          enabled: true
        };
        updatedItems.push(newItem);
      }
    } else {
      // Al deshabilitar, mantener el ID pero cambiar enabled a false
      updatedItems = updatedItems.map(link => {
        if (link.name === socialNetwork) {
          return {
            ...link,
            enabled: false
          };
        }
        return link;
      });
    }
  
    // Ordenar los items por ID para mantener consistencia
    updatedItems.sort((a, b) => (a.id || 0) - (b.id || 0));
  
    // Actualizar el estado del usuario
    queryClient.setQueryData(['user'], (prevData: User) => ({
      ...prevData,
      links: JSON.stringify(updatedItems)
    }));
  }

  return (
    <>
      <div className="space-y-5">
        {
          devTreeLinks.map(item => (
            <DevTreeInput
              key={item.name}
              item={item}
              handleUrlChange={handleUrlChange}
              handleEnabledLink={handleEnabledLink}
            />
          ))}
        <button
          className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold"
          //Cuando el usuario de click en guardar cambios obtenga los datos del cache
          onClick={() => mutate( queryClient.getQueryData(['user'])!)}
        >Guardar Cambios</button>
      </div>
    </>
  )
}
