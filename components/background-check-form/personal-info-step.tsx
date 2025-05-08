'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PersonalInfo } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SectionHeader } from './section-header';
import { countryList } from '@/lib/country-list';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { kenyaCounties } from '@/lib/kenya-counties';
import { phoneRegex } from '@/lib/validation';

const personalInfoSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  secondName: z.string().min(2, { message: 'Second name must be at least 2 characters' }),
  phone: z.string().regex(phoneRegex, { message: 'Invalid phone number format. Use format +254XXXXXXXXX' }),
  email: z.string().email({ message: 'Invalid email address' }),
  idNumber: z.string().min(1, { message: 'ID number is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  county: z.string().min(1, { message: 'County/State is required' }),
  physicalAddress: z.string().min(5, { message: 'Physical address must be at least 5 characters' }),
});

interface PersonalInfoStepProps {
  formData: PersonalInfo;
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
}

export function PersonalInfoStep({ formData, updateFormData, onNext }: PersonalInfoStepProps) {
  const [selectedCountry, setSelectedCountry] = useState(formData.country || '');
  
  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: formData.firstName,
      secondName: formData.secondName,
      phone: formData.phone,
      email: formData.email,
      idNumber: formData.idNumber,
      country: formData.country,
      county: formData.county,
      physicalAddress: formData.physicalAddress,
    },
  });

  function onSubmit(values: z.infer<typeof personalInfoSchema>) {
    Object.entries(values).forEach(([key, value]) => {
      updateFormData(key, value);
    });
    
    onNext();
  }

  return (
    <Card className="mt-6 border-0 shadow-md">
      <CardContent className="pt-6">
        <SectionHeader
          title="Personal Information"
          description="Please provide your personal details for the background check."
        />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="secondName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Second Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="+254712345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your ID number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country*</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedCountry(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countryList.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="county"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>County/State*</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select county/state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedCountry === 'Kenya' ? (
                          kenyaCounties.map((county) => (
                            <SelectItem key={county} value={county}>
                              {county}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="other">Other</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="physicalAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physical Address*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your full physical address" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CardFooter className="flex justify-end px-0 pb-0">
              <Button type="submit" size="lg">
                Continue to Documents
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}