import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { ResourceConfig, NextPanelActions } from "../types";
import { AutoForm } from "../form/auto-form";

interface ResourceCreatePageProps {
  resource: ResourceConfig;
  actions: Pick<NextPanelActions, "createRecord" | "updateRecord" | "getRelationOptions">;
}

export function ResourceCreatePage({ resource, actions }: ResourceCreatePageProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" render={<Link href={`/admin/${resource.slug}`} />}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {resource.pluralLabel}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create {resource.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <AutoForm resource={resource} mode="create" actions={actions} />
        </CardContent>
      </Card>
    </div>
  );
}
