import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import rsvpPhoto from "@/assets/rsvp-photo.jpg";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heart } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  attendance: z.enum(["attending", "not-attending"], {
    required_error: "Please select your attendance",
  }),
  guests: z.string().optional(),
  dietary: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const RSVPForm = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      guests: "",
      dietary: "",
      message: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("RSVP submitted:", data);
    setIsSubmitted(true);
  };

  const attendance = form.watch("attendance");

  if (isSubmitted) {
    return (
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut"
              }}
            >
              <Heart className="w-12 h-12 mx-auto mb-6 text-rose" />
            </motion.div>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">
              Thank You
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Your response has been received. We are so grateful you'll be part
              of our special day. We can't wait to celebrate with you.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-32 bg-card">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            We Hope You Can Join Us
          </p>
          <h2 className="heading-elegant font-serif text-4xl md:text-5xl lg:text-6xl">
            Kindly Respond
          </h2>
          <div className="divider-editorial mt-8" />
          <p className="text-muted-foreground mt-8 max-w-md mx-auto">
            Please respond by August 1st, 2026
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto items-center">
          {/* Decorative Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <img
                src={rsvpPhoto}
                alt="Wedding flowers"
                className="w-full aspect-[3/4] object-cover"
              />
              {/* Decorative frame */}
              <div className="absolute inset-0 border border-rose/30 m-6 pointer-events-none" />
            </div>
            {/* Floating quote */}
            <motion.div 
              className="absolute -bottom-8 -right-8 bg-background p-6 shadow-xl max-w-[250px]"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="font-serif text-lg italic text-muted-foreground">
                "Can't wait to celebrate with you!"
              </p>
              <p className="text-sm tracking-wider uppercase mt-2 text-rose">— O & S</p>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm tracking-wide uppercase">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your name as it appears on the invitation"
                          className="bg-background border-border/50 focus:border-rose/50 transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm tracking-wide uppercase">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          className="bg-background border-border/50 focus:border-rose/50 transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Attendance */}
                <FormField
                  control={form.control}
                  name="attendance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm tracking-wide uppercase">
                        Will You Attend?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6 pt-2"
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem
                              value="attending"
                              id="attending"
                              className="border-border"
                            />
                            <Label
                              htmlFor="attending"
                              className="font-serif text-lg cursor-pointer"
                            >
                              Joyfully Accept
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem
                              value="not-attending"
                              id="not-attending"
                              className="border-border"
                            />
                            <Label
                              htmlFor="not-attending"
                              className="font-serif text-lg cursor-pointer"
                            >
                              Regretfully Decline
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Conditional fields for attending guests */}
                {attendance === "attending" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-8"
                  >
                    {/* Number of Guests */}
                    <FormField
                      control={form.control}
                      name="guests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm tracking-wide uppercase">
                            Number of Guests (Including Yourself)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="5"
                              placeholder="1"
                              className="bg-background border-border/50 focus:border-rose/50 transition-colors w-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Dietary Restrictions */}
                    <FormField
                      control={form.control}
                      name="dietary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm tracking-wide uppercase">
                            Dietary Restrictions
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Vegetarian, vegan, allergies, etc."
                              className="bg-background border-border/50 focus:border-rose/50 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm tracking-wide uppercase">
                        A Note for the Couple (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your wishes or a message..."
                          className="bg-background border-border/50 focus:border-rose/50 transition-colors min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-foreground text-background hover:bg-foreground/90 hover:shadow-lg hover:shadow-foreground/10 transition-all duration-300 py-6 text-sm tracking-[0.2em] uppercase"
                  >
                    Send Response
                  </Button>
                </motion.div>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RSVPForm;
