import { Button } from "@components/Button";
import { TextField } from "@components/TextField";
import { trpc } from "@lib/trpc";
import { useRouter } from "next/router";
import {
  DESCRIPTION_MAX_LENGTH,
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  NICKNAME_CHECK_ALLOWANCE_DEBOUNCE,
  SOUND_ACCEPTABLE_FILE_TYPES,
  NOTIFICATION_IMAGE_ACCEPTABLE_FILE_TYPES,
} from "@donum/shared/constants";
import React, { useState, useEffect } from "react";
import { isCorrectNickname, isNumber } from "@donum/shared/helpers";
import { ethers } from "ethers";
import { Loader } from "@components/Loader";
import { routes } from "@lib/routes";
import { Input } from "@components/Input";
import { EthIcon } from "@components/icons/EthIcon";
import { AvatarUploader } from "@components/AvatarUploader";
import { useUploadFiles } from "@hooks/useUploadFiles";
import { useSession } from "next-auth/react";
import { useDebounce } from "react-use";
import type { ExtendedNextPage } from "pages/_app";

const EditDonationPage: ExtendedNextPage = () => {
  const router = useRouter();
  const [newNickname, setNewNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(""); // empty string is for typescript
  const [avatarFile, setAvatarFile] = useState<File>();
  const [newDescription, setNewDescription] = useState("");
  const [newMinShowAmount, setNewMinShowAmount] = useState("");
  const [availableNickname, setAvailableNickname] = useState(false);
  const [notificationDuration, setNotificationDuration] = useState("");
  const [notificationImageFile, setNotificationImageFile] = useState<File>();
  const [notificationSoundFile, setNotificationSoundFile] = useState<File>();

  const { data: session } = useSession();
  // session, user and name can't be null here, because it's secured page and Layout will show warning
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const address = session!.user!.address!;
  const profile = trpc.profile.byAddress.useQuery({ address });
  const editProfile = trpc.profile.edit.useMutation();
  const uploadFiles = useUploadFiles();

  const availableNewNicknameQuery = trpc.profile.availableNickname.useQuery(
    {
      nickname: newNickname,
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  const [isReady] = useDebounce(
    async () => {
      if (
        newNickname === profile?.data?.nickname ||
        !isCorrectNickname(newNickname)
      ) {
        return;
      }
      const result = await availableNewNicknameQuery.refetch();
      setAvailableNickname(!!result.data);
    },
    NICKNAME_CHECK_ALLOWANCE_DEBOUNCE,
    [newNickname]
  );

  const setAvatar = (newAvatarFile: File) => {
    setAvatarFile(newAvatarFile);
    setAvatarUrl(URL.createObjectURL(newAvatarFile));
  };

  const onSave = async () => {
    let avatarUrl: string | undefined;
    if (avatarFile) {
      [avatarUrl] = await uploadFiles([
        {
          file: avatarFile,
          type: "avatar",
        },
      ]);
    }

    let donateDuration: number | undefined;
    if (isNumber(notificationDuration)) {
      donateDuration = Number(notificationDuration);
    }

    let notificationImageUrl: string | undefined;
    if (notificationImageFile) {
      [notificationImageUrl] = await uploadFiles([
        {
          file: notificationImageFile,
          type: "notificationImage",
        },
      ]);
    }

    let notificationSoundUrl: string | undefined;
    if (notificationSoundFile) {
      [notificationSoundUrl] = await uploadFiles([
        {
          file: notificationSoundFile,
          type: "sound",
        },
      ]);
    }

    if (
      avatarUrl ||
      donateDuration ||
      notificationImageUrl ||
      notificationSoundUrl ||
      !newMinShowAmount ||
      isNumber(newMinShowAmount)
    ) {
      editProfile.mutate({
        address,
        nickname: newNickname,
        avatarUrl,
        description: newDescription,
        minShowAmount:
          newMinShowAmount !== ""
            ? ethers.parseUnits(newMinShowAmount, "ether").toString()
            : undefined,
        notificationDuration: donateDuration,
        notificationImageUrl,
        notificationSoundUrl,
      });
    }
  };

  useEffect(() => {
    if (profile.data) {
      setNewNickname(profile.data.nickname);
      setAvatarUrl(profile.data.avatarUrl);
      setNewDescription(profile.data.description);
    }
  }, [profile.data]);

  if (profile.isLoading) return <Loader />;

  if (profile.isError || !profile.data) {
    return <div>Error</div>;
  }

  if (editProfile.isSuccess) {
    router.push(routes.dashboard);
  }

  const isNicknameValid =
    newNickname === "" ||
    newNickname === profile.data.nickname ||
    (isCorrectNickname(newNickname) && availableNickname);

  let nicknameFormatInfo;
  if (!isNicknameValid) {
    if (
      newNickname.length < NICKNAME_MIN_LENGTH ||
      newNickname.length > NICKNAME_MAX_LENGTH
    ) {
      nicknameFormatInfo = `Nickname must be between ${NICKNAME_MIN_LENGTH} and ${NICKNAME_MAX_LENGTH} characters`;
    } else if (!newNickname.match(/^(\w)*$/)) {
      nicknameFormatInfo =
        "Only alphanumeric and underscore characters are allowed in nickname";
    } else {
      nicknameFormatInfo = "This nickname is already taken";
    }
  }

  return (
    <div className="flex w-full flex-col items-center text-center">
      <AvatarUploader currentAvatarUrl={avatarUrl} onUpload={setAvatar} />
      <Input
        value={newNickname}
        onChange={(e) => {
          setNewNickname(e);
          setAvailableNickname(true);
        }}
        maxLength={NICKNAME_MAX_LENGTH}
        error={!isNicknameValid}
        placeholder="Nickname..."
        variant="underlined"
        textSize="large"
        textWeight="semibold"
      />
      <p className="text-sm">{nicknameFormatInfo}</p>
      <div className="flex w-full flex-col gap-4 pt-5 sm:max-w-4xl">
        <TextField
          placeholder="Type your description here..."
          value={newDescription}
          onChange={setNewDescription}
          minRows={6}
          maxLength={DESCRIPTION_MAX_LENGTH}
          variant="outlined"
          textSize="small"
        />
        <h2 className="pt-8 text-2xl font-semibold">
          Donation notification settings
        </h2>
        <h3>Minimal donation amount to show notification</h3>
        <Input
          value={newMinShowAmount}
          onChange={setNewMinShowAmount}
          placeholder={ethers.formatEther(profile.data.minShowAmount)}
          textSize="small"
          rightCorner={
            <div className="flex flex-col items-end">
              <EthIcon />
            </div>
          }
        />
        <h3>Notification duration</h3>
        <Input
          value={notificationDuration}
          onChange={setNotificationDuration}
          placeholder={profile.data.notificationDuration.toString()}
          textSize="small"
        />
        <h3>Notification image</h3>
        <input
          type="file"
          onChange={(e) => setNotificationImageFile(e.target.files![0])}
          accept={NOTIFICATION_IMAGE_ACCEPTABLE_FILE_TYPES.join(",")}
        />
        <h3>Notification sound</h3>
        <input
          type="file"
          onChange={(e) => setNotificationSoundFile(e.target.files![0])}
          accept={SOUND_ACCEPTABLE_FILE_TYPES.join(",")}
        />
        <div className="flex flex-row-reverse">
          <Button
            text="Save"
            onClick={onSave}
            disabled={
              !isNicknameValid ||
              (!isReady() &&
                newNickname !== profile.data.nickname &&
                newNickname !== "")
            }
          />
        </div>
      </div>
    </div>
  );
};
EditDonationPage.requireAuth = true;

export default EditDonationPage;
