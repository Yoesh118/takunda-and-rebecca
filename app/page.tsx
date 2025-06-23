"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Volume2, VolumeX } from "lucide-react"

export default function WeddingRSVP() {
  const [currentPage, setCurrentPage] = useState("home")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

useEffect(() => {
  // Handler to play audio after user scrolls at least 10px or clicks/touches anywhere
  const tryPlayAudio = () => {
    if (!isPlaying && audioRef.current) {
      const playPromise = audioRef.current.play()
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => {
            setIsPlaying(true)
            cleanup()
          })
          .catch(() => {
            // Auto-play blocked, wait for further interaction
          })
      } else {
        setIsPlaying(true)
        cleanup()
      }
    }
  }

  const handleScroll = () => {
    if (window.scrollY >= 10) {
      tryPlayAudio()
    }
  }

  const handleUserInteraction = () => {
    tryPlayAudio()
  }

  function cleanup() {
    window.removeEventListener("scroll", handleScroll)
    window.removeEventListener("click", handleUserInteraction)
    window.removeEventListener("touchstart", handleUserInteraction)
  }

  window.addEventListener("scroll", handleScroll)
  window.addEventListener("click", handleUserInteraction)
  window.addEventListener("touchstart", handleUserInteraction)

  return cleanup
}, [isPlaying])



  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)

      // Create a proper FormData object for Google Apps Script
      const submitData = new FormData()
      submitData.append("Name", (formData.get("name") as string) || "")
      submitData.append("Phone Number", (formData.get("phoneNumber") as string) || "")
      submitData.append("Attendance", (formData.get("attendance") as string) || "")
      submitData.append("Dietary Requirements", (formData.get("dietary") as string) || "")
      submitData.append("Message", (formData.get("message") as string) || "")
      submitData.append("Submission Date", new Date().toLocaleString())

      // Debug log to check form data
      console.log("Form data being submitted:")
      for (const [key, value] of submitData.entries()) {
        console.log(key, value)
      }

      // Submit to Google Apps Script Web App
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxdS3MX7gwoFTwTe-H4g2uyY5Tygi2EkMmiTTlzI_LVOLc8mqRlYla_dmM6df3vOqJE/exec",
        {
          method: "POST",
          body: submitData,
          mode: "no-cors",
        },
      )

      // Show success message
      alert(
        "Thank you for your RSVP! We look forward to celebrating with you. A confirmation will be sent to rachelmakwara@gmail.com",
      )

      // Reset form
      form.reset()
    } catch (error) {
      console.error("Error submitting RSVP:", error)
      alert("There was an error submitting your RSVP. Please try again or contact us directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const NavBar = () => (
    <nav className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 bg-[#faf9ff] relative">
      <div className="flex flex-col items-center mb-4 sm:mb-0">
        <div className="text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] font-['Inter'] font-medium text-gray-600 mb-1 text-center">
          MATHATHU | MAKWARA
        </div>
        <div className="text-xs text-gray-500 text-center max-w-xs px-2">
          FAMILIES INVITE YOU TO WITNESS A JOYFUL OCCASION
        </div>
        <div className="mt-2">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/floral-radiance-monochrome-bouquet-icon-ethereal-posy-harmony-black-symbol-vector.jpg-KPryJeO0tzNrLehweQyVWMToEvwRx4.jpeg"
            alt="Elegant floral bouquet decoration"
            className="w-12 h-9 sm:w-16 sm:h-12 object-contain"
          />
        </div>
      </div>
      <div className="flex items-center space-x-6 sm:space-x-8">
        <button
          onClick={() => setCurrentPage("home")}
          className={`text-base sm:text-lg font-['Inter'] font-medium ${
            currentPage === "home" ? "border-b-2 border-black pb-1" : ""
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setCurrentPage("rsvp")}
          className={`text-base sm:text-lg font-['Inter'] font-medium ${
            currentPage === "rsvp" ? "border-b-2 border-black pb-1" : ""
          }`}
        >
          RSVP
        </button>
        <button
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title={isMuted ? "Unmute music" : "Mute music"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </nav>
  )

  const HomePage = () => (
    <div className="min-h-screen bg-[#faf9ff] flex flex-col">
      <NavBar />
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 text-center">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-['Playfair_Display'] font-light text-gray-900 mb-6 sm:mb-8 leading-tight tracking-tight">
            Rebecca & Takunda
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-['Inter'] font-light text-gray-700 mb-6 sm:mb-4 px-4">
            have decided to tie the knot
          </p>
          <Button
            onClick={() => setCurrentPage("rsvp")}
            className="bg-black text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg rounded-none border-2 border-black hover:bg-white hover:text-black transition-colors w-full sm:w-auto"
          >
            CLICK HERE TO RSVP
          </Button>
        </div>
      </div>

      {/* Theme Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
            <div className="flex justify-center order-1 lg:order-1">
              <img
                src="/images/new-couple-photo.jpg"
                alt="Rebecca and Takunda formal engagement photo in garden setting"
                className="rounded-lg shadow-lg max-w-full h-auto w-full max-w-md"
              />
            </div>
            <div className="flex flex-col justify-center order-2 lg:order-2 px-4 sm:px-0">
              <h2 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-light mb-4 sm:mb-6 text-center lg:text-left">
                Theme
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6 text-center lg:text-left">
                <span className="font-semibold">Please dress modestly:&nbsp;</span>
                No slacks, revealing clothes or short dresses for women.&nbsp; No shorts or vests for men.
                <br />
                Our colours are navy blue and lilac, however your presence is more important to us than the dress/tie
                you wear 😊
              </p>
              <h2 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-light mb-4 sm:mb-6 text-center lg:text-left">
                Date & Time
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6 text-center lg:text-left">
                09 August 2025, 1000hrs
              </p>
              <h2 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-light mb-4 sm:mb-6 text-center lg:text-left">
                Location
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center lg:text-left mb-6">
                7 Bay Noakes Rd, Colne Valley Nature Reserve Park
              </p>
              <h2 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-light mb-4 sm:mb-6 text-center lg:text-left">
                Gifts
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center lg:text-left">
                Your presence is worth more to us than any gift this world could afford. Taking time out of your busy
                schedules to come and celebrate with us is more than enough. If you insist however, we would be very
                honoured to receive any gift you have for us although cash gifts are preferred.
              </p>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-light text-center mb-6 sm:mb-8">
              Our Journey
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
              <div className="flex justify-center">
                <img
                  src="/images/engagement-photo-1.jpg"
                  alt="Rebecca and Takunda formal engagement photo by the pool"
                  className="rounded-lg shadow-lg max-w-full h-auto w-full object-cover aspect-[3/4] hover:shadow-xl transition-shadow duration-300"
                  loading="lazy"
                  width="400"
                  height="533"
                  style={{ imageRendering: "auto" }}
                />
              </div>
              <div className="flex justify-center">
                <img
                  src="/images/engagement-photo-2.jpg"
                  alt="Rebecca and Takunda engagement photo in garden setting"
                  className="rounded-lg shadow-lg max-w-full h-auto w-full object-cover aspect-[3/4] hover:shadow-xl transition-shadow duration-300"
                  loading="lazy"
                  width="400"
                  height="533"
                  style={{ imageRendering: "auto" }}
                />
              </div>
              <div className="flex justify-center">
                <img
                  src="/images/engagement-photo-3.jpg"
                  alt="Rebecca and Takunda intimate moment during engagement shoot"
                  className="rounded-lg shadow-lg max-w-full h-auto w-full object-cover aspect-[3/4] hover:shadow-xl transition-shadow duration-300"
                  loading="lazy"
                  width="400"
                  height="533"
                  style={{
                    imageRendering: "crisp-edges",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 sm:py-8 text-gray-600 text-sm sm:text-base">
        © 2025. All Rights Reserved.
      </footer>
    </div>
  )

  const RSVPPage = () => (
    <div className="min-h-screen bg-[#faf9ff]">
      <NavBar />
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-['Playfair_Display'] font-light text-center mb-8 sm:mb-12">
            RSVP
          </h1>

          {/* RSVP Form - Submits to Google Sheets via Google Apps Script */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-['Playfair_Display'] font-light mb-4 sm:mb-6 text-center">
                Please Respond by 01 July 2025
              </h2>
              <p className="mb-4 sm:mb-6 text-sm sm:text-base text-center sm:text-left px-2 sm:px-0">
                <span className="text-red-600 font-semibold">*Please Note:</span> Even if you and your spouse/ family
                members were invited, this form only records or reserves a seat for <b>ONE</b> guest. This invitation is
                strictly for you and is not transferable. <b>Regrettably No Children.</b>
              </p>
              <form onSubmit={handleRSVPSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm sm:text-base">
                      Full Name *
                    </Label>
                    <Input id="name" name="name" type="text" required className="mt-2" autoComplete="name" />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber" className="text-sm sm:text-base">
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      pattern="[0-9+\-\s$$$$]*"
                      title="Please enter a valid phone number (numbers, spaces, +, -, (, ) only)"
                      required
                      className="mt-2"
                      autoComplete="tel"
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement
                        input.value = input.value.replace(/[^0-9+\-\s$$$$]/g, "")
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm sm:text-base">Will you be attending? *</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="yes" name="attendance" value="yes" required />
                      <Label htmlFor="yes" className="text-sm sm:text-base">
                        Yes, I'll be there!
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="no" name="attendance" value="no" required />
                      <Label htmlFor="no" className="text-sm sm:text-base">
                        Sorry, I can't make it
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="dietary" className="text-sm sm:text-base">
                    Dietary Requirements
                  </Label>
                  <Input
                    id="dietary"
                    name="dietary"
                    type="text"
                    placeholder="Any allergies or special dietary needs?"
                    className="mt-2"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm sm:text-base">
                    Message for the Couple
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Share your well wishes..."
                    className="mt-2"
                    rows={4}
                  />
                </div>

                <Separator />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-3 text-base sm:text-lg rounded-none border-2 border-black hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit RSVP"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 sm:py-8 text-gray-600 text-sm sm:text-base">
        © 2025. All Rights Reserved.
      </footer>
    </div>
  )

  return (
    <div className="font-['Inter']">
      {/* Background Audio */}
      <audio ref={audioRef} loop preload="auto" className="hidden">
        <source src="/audio/give-thanks.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {currentPage === "home" ? <HomePage /> : <RSVPPage />}
    </div>
  )
}
