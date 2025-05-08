import { SiteHeader } from '@/components/site-header';
import { FormContainer } from '@/components/background-check-form/form-container';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 bg-muted/30 pb-16">
        <section className="bg-primary text-primary-foreground py-12 mb-8">
          <div className="container max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Background Check Application</h1>
            <p className="text-primary-foreground/80 max-w-2xl">
              Complete this form to submit your details for background verification by Saary Network International. 
              You can save your progress and return to complete it later.
            </p>
          </div>
        </section>
        
        <FormContainer />
      </main>
      
      <footer className="border-t py-6 bg-background">
        <div className="container max-w-4xl text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Saary Network International. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}