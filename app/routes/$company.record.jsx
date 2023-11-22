import React, { useState, useEffect } from "react";
import { json } from "@remix-run/node";
import { useActionData, Form, useLoaderData } from "@remix-run/react";
import { sendMail } from "../utils/sendMail.server";
import { sendSMS } from "../utils/sendSMS.server";
import { RiClipboardLine } from "react-icons/ri";
import {
  uploadVideo,
  login,
  getCustomers,
  getDownloadURLToVideo,
} from "../services/firebase/firebase";

export const action = async ({ request }) => {
  const formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);

  const recipient = formData.get("recipient");
  const subject = formData.get("subject");
  const message = formData.get("message");
  const phoneNumber = formData.get("phoneNumber");
  const countryCode = formData.get("countryCode");
  const isEmail = formData.get("isEmail");
  const isSMS = formData.get("isSMS");

  const completePhoneNumber = countryCode + phoneNumber;

  if (isEmail && isSMS) {
    if (_action === "send") {
      try {
        await sendMail(recipient, subject, message);
        await sendSMS(message, completePhoneNumber);
        return json({ success: "Sent email and sms successfully" });
      } catch (error) {
        console.error(error);
        return json({
          failed: "Failed to send email and sms",
          error: error.message,
        });
      }
    }
  } else if (isEmail && !isSMS) {
    if (_action === "send") {
      try {
        await sendMail(recipient, subject, message);
        return json({ success: "Sent email successfully" });
      } catch (error) {
        console.error(error);
        return json({ failed: "Failed to send email", error: error.message });
      }
    }
  } else if (!isEmail && isSMS) {
    if (_action === "send") {
      try {
        await sendSMS(message, completePhoneNumber);
        return json({ success: "Sent sms successfully" });
      } catch (error) {
        console.error(error);
        return json({ failed: "Failed to send sms", error: error.message });
      }
    }
  }

  return null;
};

export default function Record() {
  const actionData = useActionData();
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoFile, setVideoFile] = useState();
  const [videoSize, setVideoSize] = useState();
  const [openVideo, setOpenVideo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [showIsEmail, setShowIsEmail] = useState(false);
  const [showIsSMS, setShowIsSMS] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  async function fetchData() {
    try {
      await login("thomas@onecode.dk", "onecode123");
    } catch (error) {
      console.error("Error logging in: ", error);
    }
    try {
      const customersQuerySnapshot = await getCustomers("123");
      const customerData = [];
      customersQuerySnapshot.forEach((doc) => {
        customerData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCustomers(customerData);
    } catch (error) {
      console.error("Error fetching customers: ", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendVideo = async () => {
    try {
      if (!(videoFile instanceof Blob)) {
        throw new Error("videoFile must be a Blob or File object");
      }

      const convertToBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });

      const base64Video = await convertToBase64(videoFile);
      const video = await uploadVideo(base64Video, "123", "123");
      console.log("video ", video.data);
      const videoURL = await getDownloadURLToVideo(video.data);
      console.log("video url", videoURL);
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };

  const handleOpenVideo = () => {
    setOpenVideo((openVideo) => !openVideo);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setVideoFile(file);
      setVideoSize(file.size);
    }
    setOpenVideo(false);
  };

  const handleIsEmail = () => {
    setShowIsEmail((showIsEmail) => !showIsEmail);
  };

  const handleIsSMS = () => {
    setShowIsSMS((showIsSMS) => !showIsSMS);
  };

  const copyToClipboard = async (text, setCopied) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleCustomerChange = (event) => {
    const customer = customers.find(
      (c) => c.id.toString() === event.target.value
    );
    setSelectedCustomer(customer);
  };

  return (
    <>
      <video
        width="320"
        height="240"
        controls
        className="w-full lg:w-[90%] lg:w-[30%]"
      >
        <source
          src="https://firebasestorage.googleapis.com/v0/b/webvideol-sning.appspot.com/o/companies%2F123%2Fcustomers%2F123%2FxIwc2urgvd2Uf7sZ0GkP.mp4?alt=media&token=468080e1-5fc5-4aca-be3b-debf398379de"
          type="video/mp4"
        ></source>
      </video>
      <div className="p-4 mb-24 fixed bottom-0 z-80 w-full flex flex-col items-center lg:relative">
        {openVideo && (
          <div className="w-full flex flex-col items-center">
            <button
              type="button"
              className="border-2 px-4 py-1 rounded-lg w-full"
              onClick={handleOpenVideo}
            >
              Close
            </button>
            <h2 className="text-lg my-2">Select Video</h2>
            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleFileChange}
            />
            <h2 className="text-lg my-2">Record</h2>
            <input
              type="file"
              name="video"
              accept="video/*"
              capture
              onChange={handleFileChange}
            />
          </div>
        )}
        {!openVideo && !videoSrc && (
          <button
            type="button"
            onClick={handleOpenVideo}
            className="border-2 px-4 py-1 w-full"
          >
            Open
          </button>
        )}
      </div>
      <div>
        <button type="button" onClick={handleSendVideo}>
          Send Video
        </button>
      </div>
      {videoSrc && (
        <div className="flex justify-center items-center p-4 flex-col">
          <video
            width="320"
            height="240"
            controls
            className="w-full lg:w-[90%] lg:w-[30%]"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="mt-10 w-full flex flex-col-reverse items-end justify-center">
            <input
              type="text"
              value={videoSrc}
              disabled
              className="w-full"
              readOnly
            />
            <div className="flex items-center">
              {copied && <p className="text-green-400">Copied to Clipboard</p>}
              <RiClipboardLine
                size={20}
                onClick={() => copyToClipboard(videoSrc, setCopied)}
                className="cursor-pointer icon"
              />
            </div>
          </div>
          <Form method="post" className="flex flex-col w-full mt-4">
            <div className="flex justify-between items-center my-6">
              <div className="flex flex-col items-center justify-between">
                <label htmlFor="customers">Customer</label>
                <select name="customers" onChange={handleCustomerChange}>
                  <option value="">---</option>
                  {customers.map((c) => {
                    return (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex flex-col items-center justify-between">
                <label htmlFor="isEmail">Send Email</label>
                <input
                  type="checkbox"
                  name="isEmail"
                  value={showIsEmail}
                  onClick={handleIsEmail}
                />
              </div>
              <div className="flex flex-col items-center justify-between">
                <label htmlFor="isSMS">Send SMS</label>
                <input
                  type="checkbox"
                  name="isSMS"
                  value={showIsSMS}
                  onClick={handleIsSMS}
                />
              </div>
            </div>
            {showIsEmail && (
              <input
                type="email"
                name="recipient"
                placeholder="Recipient's email..."
                value={selectedCustomer?.email}
                readOnly
              />
            )}
            {showIsSMS && (
              <>
                <input
                  type="text"
                  name="countryCode"
                  value={`+${selectedCustomer?.countryCode}`}
                  readOnly
                />
                <input
                  type="number"
                  name="phoneNumber"
                  placeholder="Recipient's Phone Number..."
                  value={selectedCustomer?.phoneNumber}
                  readOnly
                />
              </>
            )}

            {showIsEmail && (
              <input
                type="text"
                name="subject"
                placeholder="Subject..."
                required
              />
            )}
            {(showIsEmail || showIsSMS) && (
              <>
                <textarea
                  name="message"
                  placeholder="Your message..."
                  required
                ></textarea>
                <div className="flex justify-around my-5">
                  <button type="submit" name="_action" value="send">
                    Send
                  </button>
                </div>
              </>
            )}
          </Form>
          <p className="text-green-400">{actionData?.success}</p>
          <p className="text-red-400">{actionData?.failed}</p>
        </div>
      )}
    </>
  );
}
