import {
  RELATED_GRID_PHOTOS_TO_SHOW,
  descriptionForPhoto,
  titleForPhoto,
} from '@/photo';
import { Metadata } from 'next/types';
import { redirect } from 'next/navigation';
import {
  PATH_ROOT,
  absolutePathForPhoto,
  absolutePathForPhotoImage,
} from '@/site/paths';
import PhotoDetailPage from '@/photo/PhotoDetailPage';
import {
  getPhotosCameraMetaCached,
  getPhotosNearIdCached,
} from '@/photo/cache';
import {
  PhotoCameraProps,
  cameraFromPhoto,
  getCameraFromParams,
} from '@/camera';
import { ReactNode, cache } from 'react';

const getPhotosNearIdCachedCached = cache((
  photoId: string,
  make: string,
  model: string,
) =>
  getPhotosNearIdCached(
    photoId, {
      camera: getCameraFromParams({ make, model }),
      limit: RELATED_GRID_PHOTOS_TO_SHOW + 2,
    },
  ));

export async function generateMetadata({
  params: { photoId, make, model },
}: PhotoCameraProps): Promise<Metadata> {
  const { photo } = await getPhotosNearIdCachedCached(photoId, make, model);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto(
    photo,
    undefined,
    cameraFromPhoto(photo, { make, model }),
  );

  return {
    title,
    description,
    openGraph: {
      title,
      images,
      description,
      url,
    },
    twitter: {
      title,
      description,
      images,
      card: 'summary_large_image',
    },
  };
}

export default async function PhotoCameraPage({
  params: { photoId, make, model },
  children,
}: PhotoCameraProps & { children: ReactNode }) {
  const { photo, photos, photosGrid, indexNumber } =
    await getPhotosNearIdCachedCached(photoId, make, model);

  if (!photo) { redirect(PATH_ROOT); }

  const camera = cameraFromPhoto(photo, { make, model });

  const { count, dateRange } = await getPhotosCameraMetaCached(camera);

  return <>
    {children}
    <PhotoDetailPage {...{
      photo,
      photos,
      photosGrid,
      camera,
      indexNumber,
      count,
      dateRange,
    }} />
  </>;
}
